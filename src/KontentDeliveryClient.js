import { DeliveryClient } from '@kentico/kontent-delivery';
import { getUrlSlug } from './utils';

const deliveryClient = new DeliveryClient({
  projectId: 'ad25961e-f934-01dc-e1fa-f4dd41b84df2',
});

async function fetchKontentItem(itemCodename, depth) {
  const response = await deliveryClient
      .item(itemCodename)
      .depthParameter(depth)
      .toPromise();

  return response.item;
}

async function fetchKontentItemWithLinkedItems(itemCodename, depth) {
  const response = await deliveryClient
      .item(itemCodename)
      .depthParameter(depth)
      .toPromise();

  return {item: response.item, linkedItems: response.linkedItems};
}

async function fetchKontentItemsByCodenames(itemCodenames, depth) {
  const response = await deliveryClient
      .items()
      .inFilter("system.codename", itemCodenames)
      .depthParameter(depth)
      .toPromise();

  return {
    items: response.items.reduce((map, obj) => {
      map[obj.system.codename] = obj;
      return map;
      }, {}),
    linkedItems: response.linkedItems}
}

async function fetchListingSectionRelatedData(listingSection) {
  return await deliveryClient
      .items()
      .type(listingSection.content_type.value)
      .orderByDescending(listingSection.order_by.value)
      .limitParameter(listingSection.number_of_items.value)
      .toPromise();
}

async function fetchItemsByContentType(contentType) {
  const result = await deliveryClient
      .items()
      .type(contentType)
      .toPromise();

  return result.items;
}

async function getSitemapMappings() {
  const data = await deliveryClient
      .item("homepage")
      .depthParameter(3) // depends on the sitemap level (+1 for content type to download)
      .elementsParameter(["subpages", "slug", "content", "content_type"])
      .toPromise()
      .then(result => getRawKontentItemSingleResult(result));

  const rootSlug = [];
  const pathsFromKontent = [
    {
      slug: rootSlug,
      codename: data.item.system.codename,
      type: data.modular_content[data.item.elements.content.value[0]].system.type
    }
  ];

  const subPaths = await getSubPaths(data, data.item.elements.subpages.value, rootSlug);

  const mappings = pathsFromKontent.concat(...subPaths);

  return mappings.reduce((result, item) => {
    result[getUrlSlug(item.slug)] = {
      codename: item.codename,
      type: item.type
    };

    return result;
  },{});

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
      slug: pageSlug,
      codename: currentItem.system.codename,
      type: currentItemContentWrapper.system.type
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
          slug: subItemSlug,
          codename: subItem.system.codename,
          type: subItem.system.type
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
  fetchKontentItemWithLinkedItems,
  fetchKontentItemsByCodenames,
  fetchListingSectionRelatedData,
  fetchItemsByContentType,
  getSitemapMappings
};
