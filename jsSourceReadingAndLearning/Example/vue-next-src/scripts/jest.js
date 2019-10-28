/**
 * This file is the entry for debug single test file in vscode
 * 此文件是vscode中的调试单个测试文件的条目
 *
 * Not using node_modules/.bin/jest due to cross platform issues, see
 * 由于跨平台问题，未使用node_modules/.bin/jest，请参阅:
 * https://github.com/microsoft/vscode-recipes/issues/107
 */
require('jest').run(process.argv)
