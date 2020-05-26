import { atom, AtomOptions, RecoilState } from 'recoil';

const atoms = new Map<string, RecoilState<any>>();

export const getOrCreateAtom = <T>(
  fn: (key: string) => AtomOptions<T>
): (key: string) => RecoilState<T> => {
  return (key: string) => {
    const options = fn(key);
    if (!atoms.has(options.key)) {
      atoms.set(options.key, atom<T>(options));
    }

    return atoms.get(options.key)!;
  };
};

export const releaseAtom = (key: string) => atoms.delete(key);
