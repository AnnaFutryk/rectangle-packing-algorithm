function calculateBestFit(blocks, containerWidth, containerHeight) {
  const sortedBlocks = [...blocks];
  sortedBlocks.sort((a, b) => b.width * b.height - a.width * a.height);

  const blockCoordinates = [];
  let currentX = 0;
  let currentY = 0;
  let maxHeightInRow = 0;

  sortedBlocks.forEach(block => {
    const width = block.width;
    const height = block.height;

    if (
      currentX + width <= containerWidth &&
      currentY + height <= containerHeight
    ) {
      blockCoordinates.push({
        left: currentX,
        top: currentY,
        right: currentX + width,
        bottom: currentY + height,
        initialOrder: blocks.indexOf(block) + 1,
        color: getRandomColor(),
      });

      currentX += width;
      maxHeightInRow = Math.max(maxHeightInRow, height);
    } else {
      currentX = 0;
      currentY += maxHeightInRow;
      maxHeightInRow = height;

      blockCoordinates.push({
        left: currentX,
        top: currentY,
        right: currentX + width,
        bottom: currentY + height,
        initialOrder: blocks.indexOf(block) + 1,
        color: getRandomColor(),
      });

      currentX += width;
    }
  });

  for (let i = 0; i < blockCoordinates.length - 1; i++) {
    const currentBlock = blockCoordinates[i];
    const nextBlock = blockCoordinates[i + 1];

    if (currentBlock.right < nextBlock.left) {
      const freeSpaceWidth = nextBlock.left - currentBlock.right;

      const smallerBlocks = blocks.filter(
        block =>
          block.width <= freeSpaceWidth && block.height <= containerHeight
      );

      let currentXSmaller = currentBlock.right;

      smallerBlocks.forEach(smallerBlock => {
        const width = smallerBlock.width;
        const height = smallerBlock.height;

        blockCoordinates.push({
          left: currentXSmaller,
          top: currentY,
          right: currentXSmaller + width,
          bottom: currentY + height,
          initialOrder: blocks.indexOf(smallerBlock) + 1,
          color: getRandomColor(),
        });

        currentXSmaller += width;
      });
    }
  }

  const totalContainerArea = containerWidth * containerHeight;
  const usedArea = blockCoordinates.reduce(
    (area, block) =>
      area + (block.right - block.left) * (block.bottom - block.top),
    0
  );

  let innerEmptySpace = 0;

  for (let i = 0; i < blockCoordinates.length - 1; i++) {
    const currentBlock = blockCoordinates[i];
    const nextBlock = blockCoordinates[i + 1];

    innerEmptySpace += (nextBlock.left - currentBlock.right) * containerHeight;
  }

  const emptySpace = totalContainerArea - usedArea - innerEmptySpace;
  const fullness = emptySpace / totalContainerArea;

  return { fullness, blockCoordinates };
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function renderBlocks(blocks) {
  const container = document.getElementById('container');
  container.innerHTML = '';

  blocks.forEach(block => {
    const blockElement = document.createElement('div');
    blockElement.className = 'block';
    blockElement.style.width = block.right - block.left + 'px';
    blockElement.style.height = block.bottom - block.top + 'px';
    blockElement.style.left = block.left + 'px';
    blockElement.style.top = block.top + 'px';
    blockElement.textContent = block.initialOrder;

    // Задаємо кольор блоку
    blockElement.style.backgroundColor = block.color;

    container.appendChild(blockElement);
  });
}

function updateUI() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const rectangles = [
    { width: 90, height: 90 },
    { width: 60, height: 115 },
    { width: 80, height: 70 },
    { width: 90, height: 120 },
    { width: 100, height: 60 },
    { width: 780, height: 85 },
    { width: 120, height: 50 },
    { width: 200, height: 300 },
    { width: 310, height: 75 },
    { width: 565, height: 95 },
  ];

  const result = calculateBestFit(rectangles, viewportWidth, viewportHeight);
  renderBlocks(result.blockCoordinates);

  console.log({
    fullness: result.fullness.toFixed(2),
    blockCoordinates: result.blockCoordinates.map(block => ({
      top: block.top,
      left: block.left,
      right: block.right,
      bottom: block.bottom,
      initialOrder: block.initialOrder,
    })),
  });
}

window.addEventListener('resize', updateUI);

updateUI();
