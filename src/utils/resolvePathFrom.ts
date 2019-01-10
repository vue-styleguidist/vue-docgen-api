export default function resolvePathFrom(path: string, from: string): string {
  return require.resolve(path, {
    paths: [from],
  });
}
