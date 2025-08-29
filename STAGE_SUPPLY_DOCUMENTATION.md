# Stage-Based Supply Management System

## Overview

This system implements a manual stage-based supply management that replaces the contract-based total supply with predefined stage supplies. The system calculates progress based on individual stage supplies and automatically transitions between stages as tokens are sold.

## Key Features

### 1. Manual Stage Configuration
- **9 Stages Total**: Each stage has its own supply, bonus, and price
- **Individual Stage Supplies**: Each stage has a predefined token supply
- **Automatic Stage Progression**: When a stage is complete, progress resets for the next stage

### 2. Stage Configuration

```javascript
Stage 1: 10,000,000 tokens, 20% bonus, $0.001 price
Stage 2: 15,000,000 tokens, 18% bonus, $0.002 price
Stage 3: 20,000,000 tokens, 16% bonus, $0.003 price
Stage 4: 25,000,000 tokens, 14% bonus, $0.004 price
Stage 5: 30,000,000 tokens, 12% bonus, $0.005 price
Stage 6: 35,000,000 tokens, 10% bonus, $0.006 price
Stage 7: 40,000,000 tokens, 8% bonus, $0.007 price
Stage 8: 45,000,000 tokens, 6% bonus, $0.008 price
Stage 9: 50,000,000 tokens, 4% bonus, $0.009 price
```

**Total Supply Across All Stages**: 270,000,000 tokens

### 3. Progress Calculation Logic

#### Current Stage Progress
- **Formula**: `(soldInCurrentStage / currentStageSupply) * 100`
- **Example**: If Stage 1 has 10M tokens and 5M are sold → 50% progress
- **Reset**: When stage completes (100%), progress resets to 0% for next stage

#### Overall Progress
- **Formula**: `(totalSold / totalSupplyAllStages) * 100`
- **Shows**: Overall progress across all 9 stages

### 4. UI Implementation

#### MB-1 Display (Supply Information)
- **Before**: Showed total supply from contracts
- **Now**: Shows current stage supply vs sold in current stage
- **Format**: `{soldInCurrentStage} / {currentStageSupply}`
- **Example**: "5.0M / 10.0M" for Stage 1

#### MB-35 Progress Bar
- **Before**: Showed overall progress based on contract total supply
- **Now**: Shows current stage progress (0-100%)
- **Resets**: Automatically resets to 0% when moving to next stage
- **Visual**: Progress bar fills based on current stage completion

### 5. Data Flow

1. **Contract Data**: Total sold tokens aggregated from ETH + BNB contracts
2. **Stage Calculation**: StageSupplyService determines current stage based on total sold
3. **Progress Calculation**: Calculates progress within current stage
4. **UI Update**: Displays stage-specific supply and progress

### 6. Example Scenarios

#### Scenario 1: Very Early Stage 1
- **Total Sold**: 1,624 tokens
- **Current Stage**: 1
- **Stage Progress**: 1% (minimum visible progress)
- **Display**: "1,624 / 10,000,000"
- **Progress Bar**: 1% filled

#### Scenario 2: Mid Stage 1
- **Total Sold**: 5,000,000 tokens
- **Current Stage**: 1
- **Stage Progress**: 50% (5M / 10M)
- **Display**: "5,000,000 / 10,000,000"
- **Progress Bar**: 50% filled

#### Scenario 3: Stage 1 Complete
- **Total Sold**: 10,000,000 tokens
- **Current Stage**: 2 (automatically moved)
- **Stage Progress**: 0% (0M / 15M in Stage 2)
- **Display**: "0 / 15,000,000"
- **Progress Bar**: 0% filled (reset for new stage)

#### Scenario 4: Mid Stage 2
- **Total Sold**: 17,500,000 tokens
- **Current Stage**: 2
- **Sold in Stage 2**: 7,500,000 (17.5M - 10M from Stage 1)
- **Stage Progress**: 50% (7.5M / 15M)
- **Display**: "7,500,000 / 15,000,000"
- **Progress Bar**: 50% filled

### 7. Files Modified

#### New Files
- `src/utils/StageSupplyService.js` - Core stage management logic

#### Modified Files
- `src/utils/AggregatedPresaleContextProvider.jsx` - Integrated stage-based logic
- `src/sections/banner/v1/BannerAggregated.jsx` - Updated UI to use stage data
- `src/sections/banner/v6/Banner.jsx` - Updated UI to use stage data

### 8. Configuration Management

#### Updating Stage Configuration
To modify stage supplies, bonuses, or prices, edit the `stageConfig` array in `StageSupplyService.js`:

```javascript
this.stageConfig = [
  { stage: 1, supply: 10000000, bonus: 20, price: 0.001 },
  // ... modify as needed
];
```

#### Adding More Stages
1. Add new stage objects to `stageConfig`
2. Update `maxStage` in AggregatedPresaleContextProvider.jsx
3. The system automatically handles the new stages

### 9. Benefits

1. **Flexible Supply Management**: Easy to adjust individual stage supplies
2. **Clear Progress Indication**: Users see progress within current stage
3. **Automatic Stage Transitions**: Seamless progression between stages
4. **Maintains Contract Integration**: Still uses actual sold data from contracts
5. **No Contract Changes Required**: All logic handled in frontend

### 10. Backward Compatibility

- **Contract Data**: Still pulls actual sold amounts from contracts
- **Timing**: Still uses contract stage timing for countdowns
- **Transactions**: All purchase functionality remains unchanged
- **Only Changes**: Supply display and progress calculation logic

This system provides a more granular and manageable approach to presale stage management while maintaining full integration with the existing contract infrastructure.