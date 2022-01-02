


export const remove = (save, array) => index => () => save(array.filter((e, i) => i !== index));
export const update = (save, array) => index => u => save(array.map((e, i) => i === index ? u : e));
export const add = (save, array, u) => () => save([...array, u]);
export const insert = (save, array, u) => index => () => save([...array.slice(0, index + 1), u, ...array.slice(index + 1, array.length)]);

