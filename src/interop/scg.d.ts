declare module 'mojocss/src/interop/scg' {
  export class MojoSCG {
    constructor(html: string, config?: object);
    render(): string;
  }
}
