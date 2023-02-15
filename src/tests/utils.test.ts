import { getFilename, getPackageMeta } from '../utils';

describe('getFilename', () => {
  it('should return the correct file name', () => {
    expect(getFilename('path/to/the/image.png')).toBe('image');
    expect(getFilename('path/to/the/big-cat.png')).toBe('big-cat');
  });
});

describe('getPackageMeta', () => {
  it('should return both name and version from package.json', () => {
    const meta = getPackageMeta();
    expect(meta).toHaveProperty('name');
    expect(meta).toHaveProperty('version');
    expect(meta.name).toEqual('imgup');
  });
});
