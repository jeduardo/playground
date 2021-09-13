package org.jeduardo.stellar;

import java.net.*;
import java.io.*;
import java.util.*;
import org.stellar.sdk.KeyPair;
import org.stellar.sdk.Server;
import org.stellar.sdk.responses.AccountResponse;

/**
 * Tutorial implementation from
 * <https://developers.stellar.org/docs/tutorials/create-account/
 */
public class App {
  public static void main(String... args) throws IOException {
    System.out.println("Creating keypair");
    KeyPair pair = KeyPair.random();
    System.out.println(String.format("Secret seed: %s", new String(pair.getSecretSeed())));
    System.out.println(String.format("Account ID: %s", pair.getAccountId()));

    System.out.println("Receiving bot deposit");
    String friendbotUrl = String.format("https://friendbot.stellar.org/?addr=%s", pair.getAccountId());
    InputStream response = new URL(friendbotUrl).openStream();
    Scanner scanner = new Scanner(response, "UTF-8").useDelimiter("\\A");
    String body = scanner.next();
    scanner.close();
    System.out.println(String.format("New account: %s", body));

    System.out.println("Checking account details");
    Server server = new Server("https://horizon-testnet.stellar.org");
    AccountResponse account = server.accounts().account(pair.getAccountId());
    System.out.println(String.format("Balances for account: %s", pair.getAccountId()));
    for (AccountResponse.Balance balance : account.getBalances()) {
      System.out.println(String.format("Type: %s, Code: %s, Balance: %s", balance.getAssetType(),
          balance.getAssetCode(), balance.getBalance()));
    }
    server.close();
  }
}
