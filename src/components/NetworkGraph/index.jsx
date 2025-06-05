import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import PropTypes from 'prop-types';
import './style.scss';
import forceAtlas2 from 'graphology-layout-forceatlas2';

// 边统一配色（灰绿色，透明度0.15）
const EDGE_COLOR = 'rgba(50, 142, 110, 0.7)';

// 抽样函数
const sampleData = (nodes, edges, sampleRate = 0.2) => {
  if (nodes.length <= 1000) return { nodes, edges };

  const sampledNodes = nodes.filter(() => Math.random() < sampleRate);
  const sampledNodeIds = new Set(sampledNodes.map(node => node.id));
  const sampledEdges = edges.filter(
    edge => sampledNodeIds.has(edge.source) && sampledNodeIds.has(edge.target)
  );

  return { nodes: sampledNodes, edges: sampledEdges };
};

const NetworkGraph = React.memo(
  ({ nodes, edges }) => {
    console.log('NetworkGraph 组件渲染');

    const containerRef = useRef(null);
    const sigmaRef = useRef(null);
    const graphRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, source: '', target: '' });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [isDataReady, setIsDataReady] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLayouting, setIsLayouting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('准备数据...');

    // 使用 useMemo 缓存抽样后的图数据
    const graphData = useMemo(() => {
      const sampled = sampleData(nodes || [], edges || []);
      return sampled;
    }, [nodes, edges]);

    // 检查数据是否准备好
    useEffect(() => {
      if (!isDataReady && graphData.nodes.length > 0 && graphData.edges.length > 0) {
        setIsDataReady(true);
      }
    }, [graphData, isDataReady]);

    // 更新容器尺寸
    const updateSize = useCallback(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();

        if (
          rect.width > 0 &&
          rect.height > 0 &&
          (rect.width !== containerSize.width || rect.height !== containerSize.height)
        ) {
          setContainerSize({
            width: rect.width,
            height: rect.height,
          });

          // 如果 Sigma 实例已存在，只更新其尺寸
          if (sigmaRef.current) {
            try {
              sigmaRef.current.refresh();
            } catch (error) {
              // 移除 console.warn
            }
          }
        }
      }
    }, [containerSize.width, containerSize.height]);

    // 监听容器尺寸变化
    useEffect(() => {
      let resizeTimeout;

      if (!resizeObserverRef.current) {
        resizeObserverRef.current = new ResizeObserver(() => {
          // 使用防抖处理尺寸变化
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            requestAnimationFrame(updateSize);
          }, 300); // 增加防抖时间到300ms
        });
      }

      if (containerRef.current) {
        resizeObserverRef.current.observe(containerRef.current);
        updateSize();
      }

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        clearTimeout(resizeTimeout);
      };
    }, [updateSize]);

    // 初始化 Sigma
    useEffect(() => {
      if (isInitialized && sigmaRef.current) {
        return;
      }

      if (
        !containerRef.current ||
        containerSize.width === 0 ||
        containerSize.height === 0 ||
        !isDataReady
      ) {
        return;
      }

      let isComponentMounted = true;
      let initializationInProgress = false;

      const initializeGraph = async () => {
        if (initializationInProgress) {
          return;
        }

        initializationInProgress = true;

        try {
          if (!isComponentMounted) return;

          // 确保一开始就显示进度条
          setIsLayouting(true);
          setProgress(0);
          setLoadingText('准备数据...');

          const graph = new Graph();
          graphRef.current = graph;

          // 分批添加节点
          const batchSize = 1000;
          const totalNodes = graphData.nodes.length;
          const batches = Math.ceil(totalNodes / batchSize);

          for (const [index, _] of Array.from({ length: batches }).entries()) {
            if (!isComponentMounted) return;

            const start = index * batchSize;
            const end = Math.min(start + batchSize, totalNodes);
            const batchNodes = graphData.nodes.slice(start, end);

            batchNodes.forEach(node => {
              graph.addNode(node.id, {
                x: Math.random(),
                y: Math.random(),
                size: 0.01,
                label: '',
                color: 'rgba(0,0,0,0)',
              });
            });

            setProgress(Math.floor(((index + 1) / batches) * 30));
            setLoadingText(`添加节点 ${Math.floor(((index + 1) / batches) * 100)}%`);

            // 添加延迟以确保进度条动画可见
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // 分批添加边
          const totalEdges = graphData.edges.length;
          const edgeBatches = Math.ceil(totalEdges / batchSize);

          for (const [index, _] of Array.from({ length: edgeBatches }).entries()) {
            if (!isComponentMounted) return;

            const start = index * batchSize;
            const end = Math.min(start + batchSize, totalEdges);
            const batchEdges = graphData.edges.slice(start, end);

            batchEdges.forEach(edge => {
              if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
                graph.addEdge(edge.source, edge.target, {
                  size: edge.size || 1,
                  color: EDGE_COLOR,
                });
              }
            });

            setProgress(30 + Math.floor(((index + 1) / edgeBatches) * 20));
            setLoadingText(`添加边 ${Math.floor(((index + 1) / edgeBatches) * 100)}%`);

            // 添加延迟以确保进度条动画可见
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          if (!isComponentMounted) return;

          setLoadingText('计算布局...');
          setProgress(50);

          // 添加布局计算的延迟
          await new Promise(resolve => setTimeout(resolve, 500));

          forceAtlas2(graph, {
            iterations: 20,
            settings: {
              gravity: 0.5,
              scalingRatio: 5,
              strongGravityMode: false,
              slowDown: 2,
              barnesHutOptimize: true,
              adjustSizes: true,
              edgeWeightInfluence: 0.2,
            },
          });

          if (!isComponentMounted) return;

          setProgress(100);
          setLoadingText('完成');

          const sigma = new Sigma(graph, containerRef.current, {
            minCameraRatio: 0.1,
            maxCameraRatio: 10,
            renderLabels: false,
            defaultNodeColor: 'rgba(0,0,0,0)',
            defaultEdgeColor: EDGE_COLOR,
            allowInvalidContainer: true,
            renderEdgeLabels: false,
            zIndex: true,
            labelRenderedSizeThreshold: 1,
            labelDensity: 0.5,
            labelGridCellSize: 60,
            hideEdgesOnMove: true,
            hideLabelsOnMove: true,
            // 完全禁用所有交互
            enableCamera: false,
            enableMouseWheel: false,
            enableMouseDrag: false,
            enableMouseZoom: false,
            enableMouseRotation: false,
            mouseWheelEnabled: false,
            mouseDragEnabled: false,
            mouseZoomEnabled: false,
            mouseRotationEnabled: false,
            // 禁用所有事件
            events: {
              click: false,
              doubleClick: false,
              wheel: false,
              mouseDown: false,
              mouseMove: false,
              mouseUp: false,
              touchStart: false,
              touchMove: false,
              touchEnd: false,
            },
          });

          // 手动禁用所有交互
          sigma.getMouseCaptor().kill();
          sigma.getCamera().disable();

          // 重新启用鼠标移动事件以支持悬停提示
          const mouseCaptor = sigma.getMouseCaptor();
          console.log('Mouse captor initialized:', !!mouseCaptor);

          // 使用原生事件监听器
          const container = containerRef.current;
          console.log('Adding mousemove listener to container:', !!container);

          const handleMouseMove = e => {
            try {
              const rect = container.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              const graphPosition = sigma.viewportToGraph({ x, y });

              const edges = graph.edges();
              let hoveredEdge = null;

              for (const edge of edges) {
                const source = graph.source(edge);
                const target = graph.target(edge);
                const sourcePos = graph.getNodeAttributes(source);
                const targetPos = graph.getNodeAttributes(target);

                const distance = distanceToSegment(
                  graphPosition.x,
                  graphPosition.y,
                  sourcePos.x,
                  sourcePos.y,
                  targetPos.x,
                  targetPos.y
                );

                if (distance < 0.05) {
                  hoveredEdge = edge;
                  break;
                }
              }

              if (hoveredEdge) {
                const source = graph.source(hoveredEdge);
                const target = graph.target(hoveredEdge);
                const sourceNode = graph.getNodeAttributes(source);
                const targetNode = graph.getNodeAttributes(target);

                // 用相对于容器的坐标
                setTooltip({
                  visible: true,
                  x,
                  y,
                  source: sourceNode.label || source,
                  target: targetNode.label || target,
                });
              } else {
                setTooltip({ visible: false, x: 0, y: 0, source: '', target: '' });
              }
            } catch (error) {
              console.error('Error in mousemove handler:', error);
            }
          };

          // 计算点到线段的距离
          const distanceToSegment = (px, py, x1, y1, x2, y2) => {
            const A = px - x1;
            const B = py - y1;
            const C = x2 - x1;
            const D = y2 - y1;

            const dot = A * C + B * D;
            const len_sq = C * C + D * D;
            let param = -1;

            if (len_sq !== 0) {
              param = dot / len_sq;
            }

            let xx;
            let yy;

            if (param < 0) {
              xx = x1;
              yy = y1;
            } else if (param > 1) {
              xx = x2;
              yy = y2;
            } else {
              xx = x1 + param * C;
              yy = y1 + param * D;
            }

            const dx = px - xx;
            const dy = py - yy;

            return Math.sqrt(dx * dx + dy * dy);
          };

          container.addEventListener('mousemove', handleMouseMove);
          console.log('Mousemove listener added');

          if (!isComponentMounted) return;

          sigmaRef.current = sigma;
          setIsInitialized(true);

          // 延迟隐藏进度条
          setTimeout(() => {
            if (isComponentMounted) {
              setIsLayouting(false);
            }
          }, 1000);

          const style = document.createElement('style');
          style.textContent = `
            .edge-tooltip {
              background: rgba(17, 24, 39, 0.95);
              color: #fff;
              padding: 8px 12px;
              border-radius: 8px;
              font-size: 13px;
              pointer-events: none;
              z-index: 10000;
              max-width: 300px;
              word-wrap: break-word;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              transition: all 0.2s ease;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              line-height: 1.5;
            }

            .edge-tooltip::after {
              content: '';
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 6px solid rgba(17, 24, 39, 0.95);
            }

            .edge-tooltip .edge-label {
              color: #9CA3AF;
              font-size: 12px;
              margin-bottom: 4px;
            }

            .edge-tooltip .edge-content {
              color: #fff;
              font-weight: 500;
            }
          `;
          document.head.appendChild(style);

          // 添加调试信息
          console.log('Sigma instance created:', !!sigma);
          console.log('Graph instance:', graph);
          console.log('Container element:', containerRef.current);

          // 清理函数
          return () => {
            console.log('Cleaning up event listeners');
            container.removeEventListener('mousemove', handleMouseMove);
          };
        } catch (error) {
          if (isComponentMounted) {
            setIsLayouting(false);
          }
        } finally {
          initializationInProgress = false;
        }
      };

      initializeGraph();

      return () => {
        isComponentMounted = false;
        if (sigmaRef.current) {
          sigmaRef.current.kill();
          sigmaRef.current = null;
          setIsInitialized(false);
        }
      };
    }, [isDataReady, graphData]);

    return (
      <div className="network-graph-container">
        {isLayouting && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10001,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: '#fff',
            }}
          >
            <div style={{ marginBottom: 20 }}>{loadingText}</div>
            <div
              style={{
                width: '200px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: '#1f77b4',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ marginTop: 10, fontSize: 16 }}>
              {progress}
%
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          className="sigma-container"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
            position: 'relative',
          }}
        />
        {tooltip.visible && (
          <div
            className="edge-tooltip"
            style={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)',
              marginTop: '-10px',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            <div className="edge-label">连接关系</div>
            <div className="edge-content">
              {tooltip.source}
              {' '}
→
              {tooltip.target}
            </div>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // 自定义比较函数，只在节点和边的数量发生变化时重新渲染
    return (
      prevProps.nodes.length === nextProps.nodes.length &&
      prevProps.edges.length === nextProps.edges.length
    );
  }
);

NetworkGraph.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      size: PropTypes.number,
      color: PropTypes.string,
    })
  ).isRequired,
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      target: PropTypes.string.isRequired,
      size: PropTypes.number,
      color: PropTypes.string,
    })
  ).isRequired,
};

export default NetworkGraph;
