import forceAtlas2 from 'graphology-layout-forceatlas2';

self.onmessage = function(e) {
  const { graph, settings } = e.data;

  // 执行力导向布局
  forceAtlas2(graph, {
    iterations: settings.iterations || 20,
    settings: {
      gravity: settings.gravity || 0.5,
      scalingRatio: settings.scalingRatio || 5,
      strongGravityMode: settings.strongGravityMode || false,
      slowDown: settings.slowDown || 2,
      barnesHutOptimize: settings.barnesHutOptimize || true,
      adjustSizes: settings.adjustSizes || true,
      edgeWeightInfluence: settings.edgeWeightInfluence || 0.2,
    },
  });

  // 发送完成消息
  self.postMessage({ type: 'complete', graph });
};
