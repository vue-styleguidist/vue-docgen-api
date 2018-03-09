import typescript from 'typescript'

export default function(source) {
	return typescript.transpileModule(source, {
		compilerOptions: {
			target: 'es2017',
		},
	})
}
