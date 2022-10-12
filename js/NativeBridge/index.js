// @flow

import type { PaymentDetailsBase, PaymentComplete } from './types';

import { NativeModules, Platform } from 'react-native';
const { ReactNativePayments } = NativeModules;

const IS_ANDROID = Platform.OS === 'android';

const NativePayments: {
  canMakePayments: boolean,
  canMakePaymentsUsingNetworks: boolean,
  createPaymentRequest: PaymentDetailsBase => Promise<any>,
  handleDetailsUpdate: PaymentDetailsBase => Promise<any>,
  show: () => Promise<any>,
  abort: () => Promise<any>,
  complete: PaymentComplete => Promise<any>
} = {
  canMakePayments(methodData: object) {
    return new Promise((resolve, reject) => {
      if (IS_ANDROID) {
        // Only the base package from Naoufal supports Android payments.
        reject();
      }

      // On iOS, canMakePayments is exposed as a constant.
      resolve(ReactNativePayments.canMakePayments);
    });
  },

  // TODO based on Naoufal's talk on YouTube the intention of canMakePayments is for it to work like this, so I'm thinking we can integrate Yegor's code into canMakePayments.
  // NF 2020-11-18
  canMakePaymentsUsingNetworks(usingNetworks: []) {
    // IOS method to check that user has available cards at Apple Pay
    // https://developer.apple.com/documentation/passkit/pkpaymentauthorizationviewcontroller/1616187-canmakepaymentsusingnetworks?language=occ

    return new Promise((resolve) => {
      ReactNativePayments.canMakePaymentsUsingNetworks(
        usingNetworks,
        (err, data) => resolve(data)
      );
    });
  },

  createPaymentRequest(methodData, details, options = {}) {
    return new Promise((resolve, reject) => {
      ReactNativePayments.createPaymentRequest(
        methodData,
        details,
        options,
        err => {
          if (err) return reject(err);

          resolve();
        }
      );
    });
  },

  handleDetailsUpdate(details) {
    return new Promise((resolve, reject) => {
      ReactNativePayments.handleDetailsUpdate(details, err => {
        if (err) return reject(err);

        resolve();
      });
    });
  },

  show(methodData, details, options = {}) {
    return new Promise((resolve, reject) => {
      ReactNativePayments.show((err, paymentToken) => {
        if (err) return reject(err);

        resolve(true);
      });
    });
  },

  abort() {
    return new Promise((resolve, reject) => {
      ReactNativePayments.abort(err => {
        if (err) return reject(err);

        resolve(true);
      });
    });
  },

  complete(paymentStatus) {
    return new Promise((resolve, reject) => {
      ReactNativePayments.complete(paymentStatus, err => {
        if (err) return reject(err);

        resolve(true);
      });
    });
  }
};

export default NativePayments;
