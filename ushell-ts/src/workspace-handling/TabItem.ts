export class TabItem {
  id: string = "";
  tag: any | undefined;
  title: string | React.JSX.Element = "";
  canClose: boolean = true;
  renderMethod?: () => JSX.Element;
}
