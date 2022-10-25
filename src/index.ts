import { buildCounterName } from './utils';
import { internalDiscordWebhook, publicDiscordWebhook } from './clients';
import axios from 'axios';
import Web3 from "web3";
import { IAuctionLifecycleHandler } from './types';
import { config } from './config';
import { TwitterAuctionLifecycleHandler } from './handlers/twitter';
import { DiscordAuctionLifecycleHandler } from './handlers/discord';
const SkateABI = require("./abis/SkateContract");
const SkateProxyABI = require("./abis/SkateProxyContract");

// @ts-ignore
const web3WSS = new Web3(config.RpcURL.wss[config.chainID]);
// @ts-ignore
export const SkateContract = new web3WSS.eth.Contract(
  SkateABI,
  // @ts-ignore
  config.SkateContract[config.chainID]
);

export const SkateProxyContract = new web3WSS.eth.Contract(
  SkateProxyABI,
  // @ts-ignore
  config.SkateProxyContract[config.chainID]
);

let old_auction = 0;
let old_bid = 0;
let remaining_time_flag = false;

/**
 * Create configured `IAuctionLifecycleHandler`s
 */
const auctionLifecycleHandlers: IAuctionLifecycleHandler[] = [];
if (config.twitterEnabled) {
  auctionLifecycleHandlers.push(new TwitterAuctionLifecycleHandler());
}
if (config.discordEnabled) {
  auctionLifecycleHandlers.push(
    new DiscordAuctionLifecycleHandler([internalDiscordWebhook, publicDiscordWebhook]),
  );
}

/**
 * Process the last auction, update cache and push socials if new auction or respective bid is discovered
 */
async function processAuctionTick() {
  const cachedAuctionId = old_auction;
  try {
    const resp = await axios.post('https://gnars.wtf/api/getCurrentGnarId');
    const lastAuctionId = resp.data.currentGnarId.v
    // check if new auction discovered
    if (cachedAuctionId < lastAuctionId) {
      console.log(buildCounterName(`auctions_discovered`));
      old_auction = lastAuctionId;
      old_bid = 0;
      try {
        await Promise.all(auctionLifecycleHandlers.map(h => h.printRoleTag()));
      } catch (error) {
        
      }
      console.log(buildCounterName('role tag printed'));

      try {
        await Promise.all(auctionLifecycleHandlers.map(h => h.handleNewAuction(lastAuctionId)));
      } catch (error) {
        
      }
      console.log(buildCounterName('auction_cache_updates'));
    }

    // check if new bid discovered
    const cachedBidId = old_bid;
    const bidHistResp = await axios.post('https://gnars.wtf/api/getBidHistory', {gnarId: lastAuctionId});
    const lastAuctionBids = bidHistResp.data.history;
    if (lastAuctionBids.length > 0 && cachedBidId != lastAuctionBids.length) {
      const bid = lastAuctionBids.slice(-1);
      old_bid = lastAuctionBids.length;
      try {
        await Promise.all(auctionLifecycleHandlers.map(h => h.handleNewBid(lastAuctionId, bid)));
      } catch (error) {
        
      }
      console.log(buildCounterName('new_bid_discovered'));
    }

    // show time remain is 5 min
    SkateProxyContract.methods.remainingTime().call(async (err: any, result: any) => {
      if (err){
        remaining_time_flag = false;
      } else {
        try {
          if(result < 5 * 60 + 10) // 5 min and 10 seconds  
          {
            if(remaining_time_flag){
              remaining_time_flag = false;
              await Promise.all(auctionLifecycleHandlers.map(h => h.handleTimeRemaining(lastAuctionId)));
              console.log(buildCounterName('remaining time printed'));
            }
              
          } else {
            remaining_time_flag = true;
          }
        } catch (error) {

        }
      }
    })
  } catch (err) {
    console.log(err);
  }
}


setInterval(async () => processAuctionTick(), 10000);
