import recast from 'recast'

const _types = recast.types.namedTypes

export default function resolveExportDeclaration(path, types = _types) {
  const definitions = []
  if (path.node.default) {
    definitions.push(path.get('declaration'))
  } else if (path.node.declaration) {
    if (types.VariableDeclaration.check(path.node.declaration)) {
      path.get('declaration', 'declarations').each(declarator => definitions.push(declarator))
    } else {
      definitions.push(path.get('declaration'))
    }
  } else if (path.node.specifiers) {
    path
      .get('specifiers')
      .each(specifier =>
        definitions.push(specifier.node.id ? specifier.get('id') : specifier.get('local'))
      )
  }
  return definitions
}
