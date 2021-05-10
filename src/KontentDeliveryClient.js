import { DeliveryClient } from '@kentico/kontent-delivery';

const deliveryClient = new DeliveryClient({
  projectId: 'ad25961e-f934-01dc-e1fa-f4dd41b84df2',
  //projectId: '30151ff3-f65b-003e-5e7a-4fa6460c47b4',
});

async function fetchKontentItem(itemCodename, depth) {
  const response = await deliveryClient
      .item(itemCodename)
      .depthParameter(depth)
      .toPromise();

  return response.item;
}

async function fetchListingSectionRelatedData(listingSection) {
  const linkedItemsResponse = await deliveryClient.items()
      .type(listingSection.content_type.value)
      .orderByDescending(listingSection.order_by.value)
      .limitParameter(listingSection.number_of_items.value)
      .toPromise();

  return linkedItemsResponse;
}

async function getSitemapMappings() {
  const data = await deliveryClient.item("homepage")
      .depthParameter(3) // depends on the sitemap level (+1 for content type to download)
      .elementsParameter(["subpages", "slug", "content", "content_type"])
      .toPromise()
      .then(result => getRawKontentItemSingleResult(result));

  const rootSlug = [];
  const pathsFromKontent = [
    {
      params: {
        slug: rootSlug,
        navigationItem: data.item.system, // will be ignored by next in getContentPaths
        contentItem: data.modular_content[data.item.elements.content.value[0]].system // will be ignored by next in getContentPaths
      }
    }
  ];

  const subPaths = await getSubPaths(data, data.item.elements.subpages.value, rootSlug);

  return pathsFromKontent.concat(...subPaths);
}

function getRawKontentItemSingleResult(response) {
  return {
    item: response.item._raw,
    modular_content: Object.fromEntries(
        Object.entries(response.linkedItems).map(([key, value]) => [key, value._raw])
    )
  };
}

function getRawKontentItemListingResult(response) {
  return {
    items: response.items.map(item => item._raw),
    modular_content: Object.fromEntries(
        Object.entries(response.linkedItems).map(([key, value]) => [key, value._raw])
    ),
    pagination: {
      ...response.pagination,
      totalCount: !!response.pagination.totalCount
    }
  };
}

async function getSubPaths(data, pagesCodenames, parentSlug) {
  const paths = [];

  for (const pageCodename of pagesCodenames) {
    const currentItem = data.modular_content[pageCodename];
    const pageSlug = parentSlug.concat(currentItem.elements.slug.value);
    const currentItemContentWrapper = data.modular_content[currentItem.elements.content.value[0]];

    paths.push({
      params: {
        slug: pageSlug,
        navigationItem: currentItem.system, // will be ignored by next in getContentPaths
        contentItem: currentItemContentWrapper.system // will be ignored by next in getContentPaths
      }
    });

    // Listing pages
    if (currentItemContentWrapper && currentItemContentWrapper.system.type === "listing_page") {
      const subItemsData = await deliveryClient.items()
          .type(currentItemContentWrapper.elements.content_type.value)
          .elementsParameter(["slug"])
          .toPromise()
          .then(result => getRawKontentItemListingResult(result));

      subItemsData.items.forEach(subItem => {
        const subItemSlug = pageSlug.concat(subItem.elements.slug.value);
        paths.push({
          params: {
            slug: subItemSlug,
            navigationItem: subItem.system, // will be ignored by next in getContentPaths
            // Listing items contains navigation and content item in one content model
            contentItem: subItem.system // will be ignored by next in getContentPaths
          }
        });
      });
    }

    const subPaths = await getSubPaths(data, currentItem.elements.subpages.value, pageSlug);
    paths.push(...subPaths);
  }

  return paths;
}

export {
  fetchKontentItem,
  fetchListingSectionRelatedData,
  getSitemapMappings
};
