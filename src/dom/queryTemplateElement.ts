export function queryTemplateElement(selectors: string): HTMLTemplateElement {
  const result = document.querySelector(selectors);
  if (result == null) {
    throw new Error(
      `Failed to query template element: No elements found with selectors "${selectors}"`
    );
  }

  if (!(result instanceof HTMLTemplateElement)) {
    throw new Error(
      `Failed to query template element: The found element was "${result.constructor.name}", not "HTMLTemplateElement" `
    );
  }

  return result;
}

export function queryElement(
  selectors: string,
  node: ParentNode = document
): Element {
  const result = node.querySelector(selectors);
  if (result == null) {
    throw new Error(
      `Failed to query template element: No elements found with selectors "${selectors}"`
    );
  }

  return result;
}

export function importTemplate(
  template: HTMLTemplateElement
): DocumentFragment {
  return document.importNode(template.content, true);
}
