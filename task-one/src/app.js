import FileTree from './fileTree';
export function createFileTree(input) {
  const fileTree = new FileTree();
  // debugged
  const fixBug = input.sort((a, b) => a.parentId - b.id);
  
  for (const inputNode of input) {
    
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;

    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}
