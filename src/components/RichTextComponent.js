import parseHTML, { domToReact } from "html-react-parser";

const IMAGE_ID_ATTRIBUTE_IDENTIFIER = "data-image-id";
const LINKED_ITEM_ID_ATTRIBUTE_IDENTIFIER = "data-item-id";

function isLinkedItem(domNode) {
  return domNode.name === "object" && domNode.attribs?.type === "application/kenticocloud";
}

function isImage(domNode) {
  return domNode.name === "figure" && typeof domNode.attribs?.[IMAGE_ID_ATTRIBUTE_IDENTIFIER] !== "undefined";
}

function isLink(domNode) {
  return domNode.name === "a" && typeof domNode.attribs?.[LINKED_ITEM_ID_ATTRIBUTE_IDENTIFIER] !== "undefined";
}

function replaceNode(domNode, richTextElement, linkedItems, mappings, resolveLinkedItem, resolveImage, resolveLink, resolveDomNode) {

  const { images, links } = richTextElement;
  if (resolveLinkedItem && linkedItems) {
    if (isLinkedItem(domNode)) {
      const codeName = domNode.attribs?.["data-codename"];
      const linkedItem = linkedItems[codeName];
      return resolveLinkedItem(linkedItem, domNode, domToReact);
    }
  }

  if (resolveImage && images) {
    if (isImage(domNode)) {
      const imageId = domNode.attribs?.[IMAGE_ID_ATTRIBUTE_IDENTIFIER];
      const image = images.find(image => image.imageId === imageId);
      return resolveImage(image, domNode, domToReact);
    }
  }

  if (resolveLink && links) {
    if (isLink(domNode)) {
      const linkId = domNode.attribs?.[LINKED_ITEM_ID_ATTRIBUTE_IDENTIFIER];
      const link = links.find(link => link.linkId === linkId);
      return resolveLink(link, mappings, domNode, domToReact);
    }
  }

  if (resolveDomNode) {
    return resolveDomNode(domNode, domToReact);
  }
}

function RichTextComponent({ richTextElement, linkedItems, mappings, resolveLinkedItem, resolveImage, resolveLink, resolveDomNode, className }) {
  const cleanedValue = richTextElement.value.replace(/(\n|\r)+/, "");
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
