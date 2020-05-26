import { RecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import * as React from 'react';

import { getOrCreateAtom, releaseAtom } from './atoms';
import IdContext from './IdContext';
import { mapValues, uniqId } from './utils';

function createContext<TValues extends {}>(defaultValues: TValues) {
  type Builders = {
    [K in keyof TValues]: (key: string) => RecoilState<TValues[K]>;
  };
  type Setters = {
    [K in keyof TValues]: React.Dispatch<React.SetStateAction<TValues[K]>>;
  };

  const fields = Object.keys(defaultValues) as (keyof TValues)[];

  const builders: Builders = mapValues(defaultValues, (defValue, name) =>
    getOrCreateAtom(key => ({
      default: defValue,
      key: `${key}/${name}`,
    }))
  );

  const RecoilContext: React.FC<{ initialValues?: Partial<TValues> }> = ({
    children,
    initialValues ,
  }) => {
    const refId = React.useRef(`$RecoilContext$${uniqId()}`);

    const setters = fields.reduce<Setters>(
      (acc: Setters, key) => ({
        ...acc,
        [key]: useSetRecoilState(builders[key](refId.current)),
      }),
      {} as Setters
    );

    React.useEffect(() => {
      for (const field of fields) {
        const initial = initialValues && initialValues[field];
        if (initial !== undefined) {
          setters[field](initial!);
        } else {
          setters[field](defaultValues[field]);
        }
      }

      return () =>
        fields.forEach(field => releaseAtom(`${refId.current}/${field}`));
    }, []);

    return (
      <IdContext.Provider value={refId.current}>{children}</IdContext.Provider>
    );
  };

  const useContextId = () => {
    const id = React.useContext(IdContext);
    if (id === null) {
      throw new Error('useContextValue is used outside of RecoilContext');
    }

    return id;
  };

  const useContextValue = <T extends keyof TValues>(name: T): TValues[T] => {
    const id = useContextId();
    return useRecoilValue(builders[name](id));
  };

  const useSetContextValue = <T extends keyof TValues>(
    name: T
  ): React.Dispatch<React.SetStateAction<TValues[T]>> => {
    const id = useContextId();
    return useSetRecoilState(builders[name](id));
  };

  return {
    RecoilContext,
    useContextValue,
    useSetContextValue,
  };
}

export default createContext;
