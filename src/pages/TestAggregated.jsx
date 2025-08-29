import { useAggregatedPresaleData } from "../utils/AggregatedPresaleContextProvider";
import Layout from "../Layout";

const TestAggregated = () => {
  const {
    totalSupply,
    totalSold,
    totalPercent,
    currentStage,
    currentBonus,
    currentPrice,
    stageEnd,
    nextPrice,
    networks,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    formattedTotalSupply,
    formattedTotalSold
  } = useAggregatedPresaleData();

  const handleRefresh = () => {
    console.log("Refreshing aggregated data...");
    refreshData();
  };

  return (
    <Layout pageTitle="Aggregated Presale Test">
      <div style={{ padding: "50px", backgroundColor: "#1a1a1a", color: "white", minHeight: "100vh" }}>
        <div className="container">
          <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
            Aggregated Presale Data Test
          </h1>

          {/* Loading State */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h3>Loading aggregated presale data...</h3>
              <p>Fetching data from ETH and BNB networks...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              backgroundColor: "#ff4444", 
              borderRadius: "10px",
              marginBottom: "20px"
            }}>
              <h3>Error Loading Data</h3>
              <p>{error}</p>
              <button 
                onClick={handleRefresh}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "white",
                  color: "#ff4444",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Success State */}
          {!isLoading && !error && (
            <div>
              {/* Aggregated Stats */}
              <div style={{ 
                backgroundColor: "#2a2a2a", 
                padding: "30px", 
                borderRadius: "10px", 
                marginBottom: "30px" 
              }}>
                <h2 style={{ marginBottom: "20px" }}>Aggregated Statistics</h2>
                <div className="row">
                  <div className="col-md-6">
                    <div style={{ marginBottom: "15px" }}>
                      <strong>Current Stage:</strong> {currentStage}
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <strong>Current Bonus:</strong> {currentBonus}%
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <strong>Current Price:</strong> ${currentPrice}
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <strong>Next Price:</strong> ${nextPrice}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ marginBottom: "15px" }}>
                      <strong>Total Supply:</strong> {formattedTotalSupply} ({totalSupply.toFixed(0)})
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <strong>Total Sold:</strong> {formattedTotalSold} ({totalSold.toFixed(0)})
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <strong>Progress:</strong> {totalPercent}%
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <strong>Stage End:</strong> {new Date(stageEnd * 1000).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Breakdown */}
              <div style={{ 
                backgroundColor: "#2a2a2a", 
                padding: "30px", 
                borderRadius: "10px", 
                marginBottom: "30px" 
              }}>
                <h2 style={{ marginBottom: "20px" }}>Network Breakdown</h2>
                <div className="row">
                  <div className="col-md-6">
                    <h4 style={{ color: "#627eea", marginBottom: "15px" }}>Ethereum Network</h4>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Total Supply:</strong> {networks.ETH.totalSupply.toFixed(0)}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Total Sold:</strong> {networks.ETH.totalSold.toFixed(0)}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Progress:</strong> {((networks.ETH.totalSold / networks.ETH.totalSupply) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4 style={{ color: "#f3ba2f", marginBottom: "15px" }}>BNB Smart Chain</h4>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Total Supply:</strong> {networks.BNB.totalSupply.toFixed(0)}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Total Sold:</strong> {networks.BNB.totalSold.toFixed(0)}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Progress:</strong> {((networks.BNB.totalSold / networks.BNB.totalSupply) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Debug Information */}
              <div style={{ 
                backgroundColor: "#2a2a2a", 
                padding: "30px", 
                borderRadius: "10px", 
                marginBottom: "30px" 
              }}>
                <h2 style={{ marginBottom: "20px" }}>Debug Information</h2>
                <div style={{ marginBottom: "15px" }}>
                  <strong>Last Updated:</strong> {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <button 
                    onClick={handleRefresh}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Refresh Data
                  </button>
                </div>
                
                {/* Raw Data */}
                <details style={{ marginTop: "20px" }}>
                  <summary style={{ cursor: "pointer", marginBottom: "10px" }}>
                    <strong>Raw Data (Click to expand)</strong>
                  </summary>
                  <pre style={{ 
                    backgroundColor: "#1a1a1a", 
                    padding: "15px", 
                    borderRadius: "5px", 
                    overflow: "auto",
                    fontSize: "12px"
                  }}>
                    {JSON.stringify({
                      totalSupply,
                      totalSold,
                      totalPercent,
                      currentStage,
                      currentBonus,
                      currentPrice,
                      stageEnd,
                      nextPrice,
                      networks,
                      lastUpdated: lastUpdated?.toISOString()
                    }, null, 2)}
                  </pre>
                </details>
              </div>

              {/* Instructions */}
              <div style={{ 
                backgroundColor: "#2a2a2a", 
                padding: "30px", 
                borderRadius: "10px" 
              }}>
                <h2 style={{ marginBottom: "20px" }}>How to Use</h2>
                <ol style={{ lineHeight: "1.8" }}>
                  <li>This page demonstrates the aggregated presale data from both ETH and BNB networks</li>
                  <li>Data is automatically refreshed every 30 seconds</li>
                  <li>Use the "Refresh Data" button to manually update the information</li>
                  <li>The aggregated view shows combined statistics from both networks</li>
                  <li>Individual network breakdowns show data from each blockchain</li>
                  <li>Stage progression is time-based and should be synchronized across networks</li>
                </ol>
                
                <h3 style={{ marginTop: "30px", marginBottom: "15px" }}>Integration</h3>
                <p>To use this in your main presale page:</p>
                <ol style={{ lineHeight: "1.8" }}>
                  <li>Replace the regular Banner component with BannerAggregated</li>
                  <li>Use the aggregated route: <code>/#/aggregated</code></li>
                  <li>Customize the display as needed for your design</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TestAggregated;