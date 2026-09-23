declare module "next/dist/compiled/picomatch" {
  type Picomatch = (
    glob: string | string[],
    options?: { dot?: boolean; contains?: boolean },
  ) => (input: string) => boolean;

  const picomatch: Picomatch;
  export default picomatch;
}
