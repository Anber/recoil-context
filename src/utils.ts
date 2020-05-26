type ObjectIterator<TObject, TResult> = (
  value: TObject[keyof TObject],
  key: string
) => TResult;

export const mapValues = <T extends object, TResult>(
  obj: T,
  callback: ObjectIterator<T, TResult>
): { [P in keyof T]: TResult } => {
  const result: Partial<{ [P in keyof T]: TResult }> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key as keyof T] = callback(value, key);
  }

  return result as { [P in keyof T]: TResult };
};

export const uniqId = ((lastId: number) => () => ++lastId)(0);
