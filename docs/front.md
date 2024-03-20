# Front-end

Use of webcomponents with a light syntax. VertJS want to be KISS (Keep it Simple Stupid) oriented.

```html
<vr-each items="tests" orderby="id">
    <article>
        <h6>{{ item.title }}</h5>
        <vr-myCustomComponent my-key="{{ item.desc }}" />
    </article>
</vr-each>
```

No need to import a component to use it.

All components are overridable.

## Routes

```html
<vr-route link="/test" params="foo={{ bar }}" />
<vr-route link="/test/sub/route/:key" key="" params="" />
```

`routes/test.ts` or `routes/test/sub/route/[key].ts`

```ts
export default function route(
  leaf: string | undefined,
  params: object | undefined,
) {}
```

## Component

```ts
@Component("my-tag")
export default class MyTag {
  constructor(attributes: object | undefined) {}
}

// or

@Component("tag") // will be convert to vr-tag
export default class Tag {
  constructor(attributes: object | undefined) {}
}
```

## Pipes

```ts
@Pipe("uppercase")
export default function uppercase(str: string) {
    return str.toUpperCase();
}
```
