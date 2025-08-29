import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ReferralPurchase,
  ReferralWithdrawn
} from "../generated/PresaleBSC/Presale"
import { User, ReferralEvent, WithdrawalEvent, GlobalStats } from "../generated/schema"

// Helper function to get or create user
function getOrCreateUser(address: Address): User {
  let user = User.load(address.toHex())
  if (user == null) {
    user = new User(address.toHex())
    user.totalReferrals = 0
    user.totalEarned = BigInt.fromI32(0)
    user.totalWithdrawn = BigInt.fromI32(0)
    user.createdAt = BigInt.fromI32(0)
    user.updatedAt = BigInt.fromI32(0)
  }
  return user as User
}

// Helper function to get or create global stats
function getOrCreateGlobalStats(): GlobalStats {
  let stats = GlobalStats.load("global")
  if (stats == null) {
    stats = new GlobalStats("global")
    stats.totalUsers = 0
    stats.totalReferrals = 0
    stats.totalVolume = BigInt.fromI32(0)
    stats.totalWithdrawn = BigInt.fromI32(0)
    stats.updatedAt = BigInt.fromI32(0)
  }
  return stats as GlobalStats
}

export function handleReferralPurchase(event: ReferralPurchase): void {
  // Create referral event
  let referralEvent = new ReferralEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  
  referralEvent.referrer = event.params.referrer.toHex()
  referralEvent.buyer = event.params.buyer
  referralEvent.usdAmount = event.params.usdAmount
  referralEvent.nativeCurrencyPaid = event.params.nativeCurrencyPaid
  referralEvent.cashbackAmount = event.params.cashbackAmount
  referralEvent.bonusPercent = event.params.bonusPercent
  referralEvent.newReferralCount = event.params.newReferralCount
  referralEvent.timestamp = event.block.timestamp
  referralEvent.transactionHash = event.transaction.hash
  referralEvent.blockNumber = event.block.number
  referralEvent.chain = "BNB"
  referralEvent.createdAt = event.block.timestamp
  
  referralEvent.save()
  
  // Update user stats
  let user = getOrCreateUser(event.params.referrer)
  let isNewUser = user.createdAt.equals(BigInt.fromI32(0))
  
  if (isNewUser) {
    user.createdAt = event.block.timestamp
  }
  
  user.totalReferrals = user.totalReferrals + 1
  user.totalEarned = user.totalEarned.plus(event.params.cashbackAmount)
  user.updatedAt = event.block.timestamp
  user.save()
  
  // Update global stats
  let stats = getOrCreateGlobalStats()
  if (isNewUser) {
    stats.totalUsers = stats.totalUsers + 1
  }
  stats.totalReferrals = stats.totalReferrals + 1
  stats.totalVolume = stats.totalVolume.plus(event.params.usdAmount)
  stats.updatedAt = event.block.timestamp
  stats.save()
}

export function handleReferralWithdrawn(event: ReferralWithdrawn): void {
  // Create withdrawal event
  let withdrawalEvent = new WithdrawalEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  
  withdrawalEvent.referrer = event.params.referrer.toHex()
  withdrawalEvent.amount = event.params.amount
  withdrawalEvent.timestamp = event.params.timestamp
  withdrawalEvent.totalWithdrawnToDate = event.params.totalWithdrawnToDate
  withdrawalEvent.transactionHash = event.transaction.hash
  withdrawalEvent.blockNumber = event.block.number
  withdrawalEvent.chain = "BNB"
  withdrawalEvent.createdAt = event.block.timestamp
  
  withdrawalEvent.save()
  
  // Update user stats
  let user = getOrCreateUser(event.params.referrer)
  user.totalWithdrawn = event.params.totalWithdrawnToDate
  user.updatedAt = event.block.timestamp
  user.save()
  
  // Update global stats
  let stats = getOrCreateGlobalStats()
  stats.totalWithdrawn = stats.totalWithdrawn.plus(event.params.amount)
  stats.updatedAt = event.block.timestamp
  stats.save()
}