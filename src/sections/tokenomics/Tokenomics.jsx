import { useState, useEffect, useRef } from "react";
import TokenomicsWrapper from "./Tokenomics.style";

// Import tokenomics data from separate file
import tokenomicsData from './tokenomicsData.js';

// Import background images for each segment
import segment1Image from '../../assets/images/tokenomics/segment-1.png';
import segment2Image from '../../assets/images/tokenomics/segment-2.png';
import segment3Image from '../../assets/images/tokenomics/segment-3.png';
import segment4Image from '../../assets/images/tokenomics/segment-4.png';
import segment5Image from '../../assets/images/tokenomics/segment-5.png';
import segment6Image from '../../assets/images/tokenomics/segment-6.png';

// Import center circle background image
import centerImage from '../../assets/images/BNBTRMP.jpg';

const Tokenomics = () => {
  // State for selected tokenomics section
  const [selectedSection, setSelectedSection] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0); // 0 to 1 for animation
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef(null);
  const segmentImagesRef = useRef([]);
  const centerImageRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // Enhanced tokenomics data with colors and segment images
  const segmentImages = [segment1Image, segment2Image, segment3Image, segment4Image, segment5Image, segment6Image];

  const enhancedTokenomicsData = tokenomicsData.map((item, index) => {
    // Extract RGB values from the color string
    const rgbMatch = item.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d\.]+\)/);
    let r = 0, g = 0, b = 0;

    if (rgbMatch) {
      r = parseInt(rgbMatch[1]);
      g = parseInt(rgbMatch[2]);
      b = parseInt(rgbMatch[3]);
    }

    // Create brighter versions for hover/selected states
    // Increase brightness while maintaining color identity
    const brightenColor = (val) => Math.min(255, val + 40);

    return {
      ...item,
      // Make colors more vibrant for better visibility
      solidColor: item.color.replace("0.9", "1"),
      // Create a brighter version for hover/selected states
      overlayColor: `rgba(${brightenColor(r)}, ${brightenColor(g)}, ${brightenColor(b)}, 0.7)`,
      // Assign a specific background image to each segment
      backgroundImage: segmentImages[index]
    };
  });

  // Calculate total percentage for the pie chart
  const totalPercentage = enhancedTokenomicsData.reduce((sum, item) => sum + item.percentage, 0);

  // Load background images on component mount
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = enhancedTokenomicsData.length + 1; // +1 for center image

    // Load all segment images
    enhancedTokenomicsData.forEach((item, index) => {
      const img = new Image();
      img.src = item.backgroundImage;
      img.onload = () => {
        segmentImagesRef.current[index] = img;
        loadedCount++;

        // Set images loaded when all images are loaded
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
    });

    // Load center image
    const centerImg = new Image();
    centerImg.src = centerImage;
    centerImg.onload = () => {
      centerImageRef.current = centerImg;
      loadedCount++;

      // Set images loaded when all images are loaded
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        drawPieChart();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw the pie chart whenever dependencies change
  useEffect(() => {
    if (imagesLoaded) {
      drawPieChart();
    }
  }, [imagesLoaded, selectedSection, hoveredSection, enhancedTokenomicsData]);

  // Main function to draw the pie chart
  const drawPieChart = () => {
    if (!canvasRef.current || !segmentImagesRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions based on container size
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    // Make the pie chart 20% bigger than original (1.0 * 1.2 = 1.2)
    const size = Math.min(containerWidth, containerHeight) * 1.2;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate center and radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.95;

    // Draw pie chart segments with image backgrounds
    let startAngle = -Math.PI / 2; // Start from top (12 o'clock position)

    // First pass: Draw all segments with background images
    enhancedTokenomicsData.forEach((item, index) => {
      const segmentAngle = (item.percentage / totalPercentage) * (Math.PI * 2);
      const endAngle = startAngle + segmentAngle;
      
      // Calculate if this segment should be detached (selected or highlighted)
      const isSelected = selectedSection && selectedSection.allocation === item.allocation;
      const isHighlighted = highlightedSection && highlightedSection.allocation === item.allocation;
      const shouldDetach = isSelected || isHighlighted;
      
      // Calculate detachment distance with animation progress for a more dynamic effect
      // Base detachment is 2.5% of radius, multiplied by animation progress (0-1) for an extremely smooth animation
      // For Community Rewards (5% segment), adjust the detachment distance to make it more noticeable but not too extreme
      const isCommunityRewards = item.allocation === "Community Rewards";
      // Use a more pronounced detachment multiplier for Community Rewards to improve visibility
      const detachMultiplier = isCommunityRewards ? 2.5 : 1.3; // 150% more detachment for Community Rewards
      // Apply a more subtle animation effect for all segments
      const animationMultiplier = 1.0; // Equal animation strength for consistency
      // Reduce the base detachment distance to 2.5% of radius for an even more subtle sliding effect
      const detachDistance = shouldDetach ? 
        radius * 0.025 * detachMultiplier * (isHighlighted ? animationProgress * animationMultiplier : 1) : 0;
      
      // Calculate the midpoint angle of this segment
      let segmentMidAngle = startAngle + (endAngle - startAngle) / 2;
      
      // Calculate the offset for the segment center
      const offsetX = Math.cos(segmentMidAngle) * detachDistance;
      const offsetY = Math.sin(segmentMidAngle) * detachDistance;
      
      // Save context state
      ctx.save();

      // Create clipping path for this segment - with detachment if needed
      ctx.beginPath();
      
      // If detached, start from a slightly offset center point
      const segmentCenterX = centerX + offsetX;
      const segmentCenterY = centerY + offsetY;
      
      // Calculate a slightly larger radius for highlighted segments to create a scale effect
      const segmentRadius = radius * (isHighlighted ? 1 + 0.05 * animationProgress : 1);
      
      ctx.moveTo(segmentCenterX, segmentCenterY);
      ctx.arc(segmentCenterX, segmentCenterY, segmentRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.clip();

      // Draw the specific background image for this segment
      const img = segmentImagesRef.current[index];
      // Make the image larger to ensure it covers the segment and is more visible
      const imgSize = Math.max(canvas.width, canvas.height) * 1.5;

      // Calculate the angle midpoint of this segment to position the image better
      // We already have midAngle defined above, so we'll reuse it

      // Offset the image position based on the segment's position in the pie
      // This helps center the image content within each segment
      const offsetDistance = radius * 0.2;
      const imgOffsetX = Math.cos(segmentMidAngle) * offsetDistance;
      const imgOffsetY = Math.sin(segmentMidAngle) * offsetDistance;

      const imgX = centerX - imgSize / 2 + imgOffsetX;
      const imgY = centerY - imgSize / 2 + imgOffsetY;

      // Enhance image contrast and saturation before drawing - strengthened filters for better visibility
      ctx.filter = 'contrast(1.5) brightness(1.3) saturate(1.4)';

      // Draw the image
      ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

      // Reset filter
      ctx.filter = 'none';

      // Add a color overlay with the segment color
      const isSegmentSelected = selectedSection && selectedSection.allocation === item.allocation;
      const isHovered = hoveredSection && hoveredSection.allocation === item.allocation;

      if (isSegmentSelected || isHovered) {
        // Reduce opacity by 15% for selected/hovered segments to increase transparency
        const baseColor = item.overlayColor || item.color;
        ctx.fillStyle = baseColor.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d\.]+\)/, 'rgba($1, $2, $3, 0.35)');
      } else {
        // Keep standard opacity for other segments
        ctx.fillStyle = item.color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d\.]+\)/, 'rgba($1, $2, $3, 0.65)');
      }
      ctx.fill();

      // Restore context state
      ctx.restore();

      startAngle = endAngle;
    });

    // Second pass: Draw segment borders
    startAngle = -Math.PI / 2;
    enhancedTokenomicsData.forEach((item) => {
      const segmentAngle = (item.percentage / totalPercentage) * (Math.PI * 2);
      const endAngle = startAngle + segmentAngle;

      // Style for segment border
      const isSelected = selectedSection && selectedSection.allocation === item.allocation;
      const isHovered = hoveredSection && hoveredSection.allocation === item.allocation;
      const isHighlighted = highlightedSection && highlightedSection.allocation === item.allocation;
      const shouldDetach = isSelected || isHighlighted;
      
      // Calculate detachment distance with animation progress for a more dynamic effect
      // Reduce base detachment for extremely smooth animation
      // For Community Rewards (5% segment), adjust the detachment distance to make it more noticeable but not too extreme
      const isCommunityRewards = item.allocation === "Community Rewards";
      // Use a more pronounced detachment multiplier for Community Rewards to improve visibility
      const detachMultiplier = isCommunityRewards ? 2.5 : 1.3; // 150% more detachment for Community Rewards
      // Apply a more subtle animation effect for all segments
      const animationMultiplier = 1.0; // Equal animation strength for consistency
      // Reduce the base detachment distance to 2.5% of radius for an even more subtle sliding effect
      const detachDistance = shouldDetach ? 
        radius * 0.025 * detachMultiplier * (isHighlighted ? animationProgress * animationMultiplier : 1) : 0;
      
      // Calculate the midpoint angle of this segment
      let segmentMidAngle = startAngle + (endAngle - startAngle) / 2;
      
      // Calculate the offset for the segment center
      const offsetX = Math.cos(segmentMidAngle) * detachDistance;
      const offsetY = Math.sin(segmentMidAngle) * detachDistance;
      
      // If detached, start from a slightly offset center point
      const segmentCenterX = centerX + offsetX;
      const segmentCenterY = centerY + offsetY;

      // Draw segment border
      ctx.beginPath();
      ctx.moveTo(segmentCenterX, segmentCenterY);
      
      // Calculate a slightly larger radius for highlighted segments to create a scale effect
      const segmentRadius = radius * (isHighlighted ? 1 + 0.05 * animationProgress : 1);
      
      ctx.arc(segmentCenterX, segmentCenterY, segmentRadius, startAngle, endAngle);
      ctx.closePath();

      ctx.lineWidth = isSelected || isHovered ? 3 : 1.5;
      ctx.strokeStyle = isSelected || isHovered ? item.solidColor : "rgba(255, 255, 255, 0.7)";
      ctx.stroke();

      startAngle = endAngle;
    });

    // Draw center circle with background image - make it 30% bigger than current size (0.2579 * 1.3 = 0.33527)
    const centerRadius = radius * 0.33527;

    // Create a circular clipping path for the center circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
    ctx.clip();

    // Draw the background image in the center circle
    if (centerImageRef.current && centerImageRef.current.complete) {
      // Calculate dimensions to ensure the image fits completely within the circle
      const circleSize = centerRadius * 2; // Diameter of the center circle

      // Get the image dimensions
      const imgWidth = centerImageRef.current.width;
      const imgHeight = centerImageRef.current.height;

      // Calculate scaling factors for width and height
      const scaleWidth = circleSize / imgWidth;
      const scaleHeight = circleSize / imgHeight;

      // Use the smaller scaling factor to ensure the entire image fits
      // without being cut off
      const scale = Math.min(scaleWidth, scaleHeight);

      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      // Position to center the image perfectly in the circle
      const imgX = centerX - scaledWidth / 2;
      const imgY = centerY - scaledHeight / 2;

      // Draw the image to perfectly fit the circle without being cut off
      ctx.drawImage(centerImageRef.current, imgX, imgY, scaledWidth, scaledHeight);

      // Add a golden overlay to enhance the image and match the theme
      ctx.fillStyle = "rgba(243, 186, 47, 0.2)";
      ctx.fill();

      // Add a subtle inner glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#f3ba2f";
      ctx.stroke();
    } else {
      // Fallback if image isn't loaded
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fill();
    }

    // Restore the context and add a stroke around the center circle
    ctx.restore();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Add a stronger golden glow effect around the center circle
    // First outer glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = "#f3ba2f";
    ctx.lineWidth = 8;
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#f3ba2f";
    ctx.stroke();

    // Second inner glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ffffff";
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Add a white inner stroke for contrast
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  // Handle mouse move on canvas to detect hovering over segments
  const handleMouseMove = (e) => {
    if (!canvasRef.current || !imagesLoaded) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate center and radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.95;

    // Calculate distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If outside the pie chart or in the center circle, clear hover state
    // Center circle size is now 0.33527 of radius
    if (distance > radius || distance < radius * 0.33527) {
      if (hoveredSection !== null) {
        setHoveredSection(null);
      }
      return;
    }

    // Calculate angle (in radians) of the mouse position
    let angle = Math.atan2(dy, dx);
    // Convert to positive angle (0 to 2π)
    if (angle < 0) angle += Math.PI * 2;
    // Adjust angle to start from top (12 o'clock position)
    // The original calculation had an issue with the 5% Community Rewards segment
    // We need to normalize the angle to start from -Math.PI/2 (top position)
    angle = (angle + Math.PI / 2) % (Math.PI * 2);

    // Find which segment the angle corresponds to
    let startAngle = 0;
    let foundSection = null;

    for (let i = 0; i < enhancedTokenomicsData.length; i++) {
      const segmentAngle = (enhancedTokenomicsData[i].percentage / totalPercentage) * (Math.PI * 2);
      const endAngle = startAngle + segmentAngle;
      
      // Special handling for the 5% Community Rewards segment
      // This segment is small and might need more precise detection
      const isCommunityRewards = enhancedTokenomicsData[i].allocation === "Community Rewards";
      const isPublicSale = enhancedTokenomicsData[i].allocation === "Public Sale";
      
      // Check if angle is within this segment
      if (isCommunityRewards) {
        // For the Community Rewards segment, we need to expand the detection area
        // since it's only 5% of the pie (18 degrees), making it harder to click
        
        // Calculate the midpoint angle of the segment
        const midAngle = startAngle + (segmentAngle / 2);
        
        // Create a wider detection zone around the segment
        // This makes it easier to click on the small segment
        const detectionThreshold = Math.PI / 10; // About 18 degrees - further increased for better detection
        
        // Check if the mouse angle is within the expanded detection zone
        const angleDiff = Math.abs(angle - midAngle);
        const wrappedAngleDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
        
        // Make sure we're not in the Public Sale area (first segment)
        // This prevents the Community Rewards detection zone from overlapping with Public Sale
        if (wrappedAngleDiff <= detectionThreshold) {
          // Additional check to ensure we're not detecting clicks in the Public Sale area
          // Public Sale is at the top (12 o'clock position)
          const publicSaleStart = 0;
          const publicSaleEnd = (40 / totalPercentage) * (Math.PI * 2); // 40% segment
          
          // Only detect Community Rewards if we're not in the Public Sale area
          // Add a buffer zone to prevent overlap with Public Sale
          const bufferZone = Math.PI / 25; // About 7.2 degrees buffer - increased for better separation
          const isInPublicSaleArea = angle >= (publicSaleStart - bufferZone) && angle < (publicSaleEnd + bufferZone);
          
          if (!isInPublicSaleArea) {
            foundSection = enhancedTokenomicsData[i];
            break;
          }
        }
      } else if (isPublicSale) {
        // Special handling for Public Sale to ensure its detection area doesn't overlap
        // with Community Rewards
        // Add a small buffer to the Public Sale detection area to prevent overlap
        const bufferZone = Math.PI / 60; // About 3 degrees buffer
        if (angle >= (startAngle - bufferZone) && angle < (endAngle - bufferZone)) {
          // Make sure we're not in the expanded detection zone of Community Rewards
          foundSection = enhancedTokenomicsData[i];
          break;
        }
      } else {
        // Normal detection for other segments
        if (angle >= startAngle && angle < endAngle) {
          foundSection = enhancedTokenomicsData[i];
          break;
        }
      }

      startAngle = endAngle;
    }

    // Only update state if it's different to avoid unnecessary re-renders
    if (hoveredSection !== foundSection) {
      setHoveredSection(foundSection);
    }
  };

  // Handle mouse leave from canvas
  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  // Handle click on canvas with animation
  const handleCanvasClick = () => {
    if (hoveredSection) {
      // If we clicked the same section that's already selected, do nothing
      if (selectedSection && hoveredSection.allocation === selectedSection.allocation) {
        return;
      }
      
      // If we're already animating, cancel any ongoing animations
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Set the selected section immediately
      setSelectedSection(hoveredSection);
      
      // Set the highlighted section immediately
      setHighlightedSection(hoveredSection);
      
      // Start with a small initial progress to show immediate feedback
      setAnimationProgress(0.1);
      
      // Immediately redraw to show initial movement
      drawPieChart();
      
      // Create a smooth "pop out" animation effect
      const animateDetachment = () => {
        // Start animation with very smooth effects
        const startTime = performance.now();
        const duration = 400; // Shorter duration for more immediate response
        
        const animate = (timestamp) => {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Use a simple ease-out function for quick start, gradual end
          const easeOutQuad = (x) => 1 - (1 - x) * (1 - x);
          
          // Apply easing to make the animation smoother
          const easedProgress = easeOutQuad(progress);
          
          // Store the animation progress for use in drawPieChart
          setAnimationProgress(easedProgress);
          
          // Redraw the chart to show the animation
          drawPieChart();
          
          // Continue animation if not complete
          if (elapsed < duration) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            // Keep the segment detached while selected
            // No return animation needed as the segment should stay detached
            animationRef.current = null;
          }
        };
        
        // Start the animation immediately
        animationRef.current = requestAnimationFrame(animate);
      };
      
      // Start the detachment animation immediately
      animateDetachment();
    }
  };

  // Handle click on tokenomics card with animation
  const handleCardClick = (item) => {
    // If we clicked the same section that's already selected, do nothing
    if (selectedSection && item.allocation === selectedSection.allocation) {
      return;
    }
    
    // If we're already animating, cancel any ongoing animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Set the selected section immediately
    setSelectedSection(item);
    
    // Set the highlighted section immediately
    setHighlightedSection(item);
    
    // Start with a small initial progress to show immediate feedback
    setAnimationProgress(0.1);
    
    // Immediately redraw to show initial movement
    drawPieChart();
    
    // Create a smooth "pop out" animation effect
    const animateDetachment = () => {
      // Start animation with very smooth effects
      const startTime = performance.now();
      const duration = 600; // Longer duration for smoother transitions
      
      const animate = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use an ease-in-out function for smoother transitions
        const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        
        // Apply easing to make the animation smoother
        const easedProgress = easeInOutCubic(progress);
        
        // Store the animation progress for use in drawPieChart
        setAnimationProgress(easedProgress);
        
        // Redraw the chart to show the animation
        drawPieChart();
        
        // Continue animation if not complete
        if (elapsed < duration) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Keep the segment detached while selected
          // No return animation needed as the segment should stay detached
          animationRef.current = null;
        }
      };
      
      // Start the animation immediately
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start the detachment animation immediately
    animateDetachment();
  };

  // Calculate total supply for display
  const totalSupplyValue = 5000000000; // Raw number value
  const totalSupply = totalSupplyValue.toLocaleString(); // Format with commas

  // Function to format token amount with short suffix for display
  const formatTokenAmount = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + ' M';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + ' K';
    }
    return amount.toString();
  };

  // Function to display tooltip for hovered section
  const renderTooltip = () => {
    if (!hoveredSection) return null;

    return (
      <div className="pie-chart-tooltip">
        <div className="tooltip-title" style={{ color: hoveredSection.solidColor }}>
          {hoveredSection.allocation}
        </div>
        <div className="tooltip-percentage">
          {hoveredSection.percentage}%
        </div>
      </div>
    );
  };

  return (
    <TokenomicsWrapper id="tokenomics">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="tokenomics-title">TOKENOMICS</h2>
            <p className="tokenomics-subtitle">
              Our token distribution is designed for long-term sustainability and growth
            </p>

            <div className="tokenomics-chart-container">
              <div className="chart-wrapper" ref={containerRef}>
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleCanvasClick}
                  className="custom-pie-chart"
                />
                {renderTooltip()}

                {/* Loading indicator */}
                {!imagesLoaded && (
                  <div className="chart-loading">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading chart...</div>
                  </div>
                )}
              </div>
            </div>

            <div className="tokenomics-grid">
              {enhancedTokenomicsData.map((item, index) => (
                <div
                  key={index}
                  className={`tokenomics-card ${selectedSection === item ? 'active' : ''} ${highlightedSection === item ? 'highlighted' : ''}`}
                  onClick={() => handleCardClick(item)}
                  style={{
                    borderColor: selectedSection === item ? item.solidColor :
                               highlightedSection === item ? item.solidColor : undefined,
                    '--index': index // Set CSS custom property for animation delay
                  }}
                >
                  <div className="percentage" style={{ color: item.solidColor }}>{item.percentage}%</div>
                  <div className="allocation">{item.allocation}</div>
                  <div className="description">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="tokenomics-details">
              <h3 className="details-title">Token Details</h3>
              <div className="details-grid">
                {[
                  { label: "Token Name", value: "BNBMAGA" },
                  { label: "Network", value: "BSC" },
                  { label: "Total Supply", value: totalSupply },
                  { label: "Initial Price", value: "$0.003" },
                  { label: "Sale Hard Cap", value: "$10,000,000" },
                  { label: "Sale Soft Cap", value: "$3,000,000" }
                ].map((detail, index) => (
                  <div
                    key={index}
                    className="detail-item"
                    style={{ '--index': index }}
                  >
                    <div className="item-label">{detail.label}</div>
                    <div className="item-value">{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TokenomicsWrapper>
  );
};

export default Tokenomics;
