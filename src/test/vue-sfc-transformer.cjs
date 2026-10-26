const { compileScript, parse } = require('@vue/compiler-sfc');
const { transformSync } = require('esbuild');

module.exports = {
  process(source, filename) {
    const { descriptor, errors } = parse(source, { filename });
    if (errors.length > 0) throw errors[0];

    const script = compileScript(descriptor, {
      id: filename,
      inlineTemplate: true,
    });
    const result = transformSync(script.content, {
      format: 'cjs',
      loader: descriptor.scriptSetup?.lang === 'ts' || descriptor.script?.lang === 'ts' ? 'ts' : 'js',
      sourcefile: filename,
      target: 'node18',
    });

    return { code: result.code };
  },
};
