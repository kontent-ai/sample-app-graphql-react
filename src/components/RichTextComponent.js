import parseHTML, { domToReact } from "html-react-parser";

const IMAGE_ID_ATTRIBUTE_IDENTIFIER = "data-image-id";
const LINKED_ITEM_ID_ATTRIBUTE_IDENTIFIER = "data-item-id";

// TODO adjust naming and detection linked item vs. component - internal link https://kentico.atlassian.net/browse/DEL-3081
function isLinkedItem(domNode) {
  return domNode.name === "object" && domNode.attribs?.type === "application/kenticocloud";
}

function isImage(domNode) {
  return domNode.name === "figure" && typeof domNode.attribs?.[IMAGE_ID_ATTRIBUTE_IDENTIFIER] !== "undefined";
}

function isLink(domNode) {
  return domNode.name === "a" && typeof domNode.attribs?.[LINKED_ITEM_ID_ATTRIBUTE_IDENTIFIER] !== "undefined";
}

// TODO adjust naming and detection linked item vs. component - internal link https://kontent-ai.atlassian.net/browse/DEL-3081
function replaceNode(domNode, richTextElement, linkedItems, mappings, resolveLinkedItem, resolveImage, resolveLink, resolveDomNode) {
  const { assets, itemHyperlinks } = richTextElement;

  if (resolveLinkedItem && linkedItems) {
    if (isLinkedItem(domNode)) {
      const codeName = domNode.attribs?.["data-codename"];
      const linkedItem = linkedItems[codeName];
      return resolveLinkedItem(linkedItem, domNode, domToReact);
    }
  }

  if (resolveImage && assets) {
    if (isImage(domNode)) {
      const imageId = domNode.attribs?.[IMAGE_ID_ATTRIBUTE_IDENTIFIER];
      const image = assets.items.find(image => image.imageId === imageId);
      return resolveImage(image, domNode, domToReact);
    }
  }

  if (resolveLink && itemHyperlinks?.items) {
    if (isLink(domNode)) {
      const linkId = domNode.attribs?.[LINKED_ITEM_ID_ATTRIBUTE_IDENTIFIER];
      const link = itemHyperlinks.items.find(link => link._system_.id === linkId);
      return resolveLink(link, mappings, domNode, domToReact);
    }
  }

  if (resolveDomNode) {
    return resolveDomNode(domNode, domToReact);
  }
}

// TODO enhance this component to be able to consume components as well ass linked items - internal link https://kontent.atlassian.net/browse/DEL-3081
function RichTextComponent({ richTextElement, mappings, resolveLinkedItem, resolveImage, resolveLink, resolveDomNode, className }) {
  const cleanedValue = richTextElement.html.replace(/(\n|\r)+/, "");
  // currenlty resolving only components
  const linkedItems = richTextElement.components?.items.reduce((result, item) => {
    result[item._system_.codename] = item;

    return result;
  },{}) || {};
  const result = parseHTML(cleanedValue, {
    replace: (domNode) => replaceNode(domNode, richTextElement, linkedItems, mappings, resolveLinkedItem, resolveImage, resolveLink, resolveDomNode),
  });

  return (
    <div className={className} >
      {result}
    </div>
  );
}

export default RichTextComponent;
