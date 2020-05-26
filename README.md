# `recoil-context`: a distributed context on top of [Recoil](https://recoiljs.org) 

## Installation
```
npm install --save recoil-context recoil
// or
yarn add recoil-context recoil
```

## Example

```typescript
// WizardContext.ts

import { createContext } from "recoil-context";

const { RecoilContext, useContextValue, useSetContextValue } = createContext({
  paymentMethod: "card" as "card" | "paypal",
  step: 1,
});

export { useContextValue, useSetContextValue };

export default RecoilContext;
```

```tsx
// Wizard.ts

import WizardContext, { useContextValue, useSetContextValue } from "./Wizard";

const Tab = ({ children, id }) => {
  const setStep = useSetContextValue("step");
  return <button onClick={() => setStep(id)}>{children}</button>;
};

const Tabs = () => {
  const method = useContextValue("paymentMethod");
  const step = useContextValue("step");
  
  return (
    <div>
      <Tab id={1} completed={step > 1}>Payment details</Tab>
      <Tab id={2} completed={step > 2}>
        {method === "card" ? "Card details" : "PayPal authorization"}
      </Tab>
      <Tab id={3} completed={step > 3}>Confirmation</Tab>
    </div>
  )
};

const Panels = () => {
  const method = useContextValue("paymentMethod");
  const step = useContextValue("step");  
  if (step === 1) { /* … */ }
  if (step === 2 && method === "card") { /* … */ }
  if (step === 2 && method === "paypal") { /* … */ }
  if (step === 3) { /* … */ }
}

const Wizard = () => {
  return (
    <WizardContext initialValues={{ paymentMethod: "paypal" }}>
      <Tabs />
      <Panels />
    </WizardContext>
  );
}
```

## API

`recoil-context` exports only one function:
##### `createContext<TValues>(defaultValues: TValues): { RecoilContext, useContextValue, useSetContextValue }`.
It accepts an object with default values and creates a strictly typed context and pair of hooks for getting and setting values:
* `RecoilContext` is a container for your state and provides values for hooks. Default values can be fully or partially overridden with `initialValues` prop;
* `useContextValue<T extends keyof TValues>(name: T): TValues[T]` returns current value from the context;
* `useSetContextValue<T extends keyof TValues>(name: T): Dispatch<SetStateAction<TValues[T]>>` returns a value setter for specified field.

## License

MIT
