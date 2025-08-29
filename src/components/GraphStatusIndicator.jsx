import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { shouldUseTheGraph, getSubgraphUrl } from '../config/features';

const StatusContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 1000;
  max-width: 300px;
  
  .status-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: #4CAF50;
  }
  
  .status-item {
    margin: 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-left: 8px;
  }
  
  .status-success {
    background-color: #4CAF50;
  }
  
  .status-error {
    background-color: #f44336;
  }
  
  .status-loading {
    background-color: #ff9800;
  }
`;

export const GraphStatusIndicator = () => {
  const [ethStatus, setEthStatus] = useState('loading');
  const [bscStatus, setBscStatus] = useState('loading');
  const [ethBlock, setEthBlock] = useState(null);
  const [bscBlock, setBscBlock] = useState(null);

  useEffect(() => {
    const checkSubgraphStatus = async () => {
      const usingGraph = shouldUseTheGraph();
      if (!usingGraph) return;

      // Check ETH subgraph
      try {
        const ethUrl = getSubgraphUrl('ethereum');
        const ethResponse = await fetch(ethUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: '{ _meta { block { number } } }'
          })
        });
        const ethData = await ethResponse.json();
        if (ethData.data?._meta?.block?.number) {
          setEthStatus('success');
          setEthBlock(ethData.data._meta.block.number);
        } else {
          setEthStatus('error');
        }
      } catch (error) {
        setEthStatus('error');
      }

      // Check BSC subgraph
      try {
        const bscUrl = getSubgraphUrl('bsc');
        const bscResponse = await fetch(bscUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: '{ _meta { block { number } } }'
          })
        });
        const bscData = await bscResponse.json();
        if (bscData.data?._meta?.block?.number) {
          setBscStatus('success');
          setBscBlock(bscData.data._meta.block.number);
        } else {
          setBscStatus('error');
        }
      } catch (error) {
        setBscStatus('error');
      }
    };

    checkSubgraphStatus();
    const interval = setInterval(checkSubgraphStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!shouldUseTheGraph()) {
    return (
      <StatusContainer>
        <div className="status-title">📊 Data Source: Legacy Block Scanning</div>
      </StatusContainer>
    );
  }

  return (
    <StatusContainer>
      <div className="status-title">📊 The Graph Protocol Status</div>
      <div className="status-item">
        <span>ETH Sepolia: Block {ethBlock || '...'}</span>
        <div className={`status-indicator status-${ethStatus}`}></div>
      </div>
      <div className="status-item">
        <span>BSC Chapel: Block {bscBlock || '...'}</span>
        <div className={`status-indicator status-${bscStatus}`}></div>
      </div>
    </StatusContainer>
  );
};