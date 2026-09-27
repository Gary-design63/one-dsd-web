import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

/** Resolve asynchronous Server Components without invoking synchronous client hooks. */
async function resolveServerChildren(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) {
    const resolved = await Promise.all(node.map(resolveServerChildren));
    return resolved.every((child, index) => child === node[index]) ? node : resolved;
  }
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<{ children?: ReactNode }>;
  if (typeof element.type === "function" && element.type.constructor.name === "AsyncFunction") {
    const component = element.type as (props: typeof element.props) => Promise<ReactNode>;
    return resolveServerChildren(await component(element.props));
  }
  if (element.props.children === undefined) return element;
  const children = await resolveServerChildren(element.props.children);
  return children === element.props.children ? element : cloneElement(element, undefined, children);
}
export async function renderServerPage(node: ReactNode): Promise<string> {
  return renderToStaticMarkup(await resolveServerChildren(node));
}
