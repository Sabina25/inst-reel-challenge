/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import {
  Instrument,
  InstrumentSymbol,
  WebSocketClientMessageJson,
  WebSocketMessage,
  WebSocketReadyState,
  WebSocketServerMessageJson,
} from "../../common-leave-me";


enum ClientMessageType {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
}

enum ServerMessageType {
  UPDATE = 'update',
}

export type InstrumentsHandler = (instruments: Instrument[]) => void

export type Subscription = {
  symbols: InstrumentSymbol[],
  handler: InstrumentsHandler,
}

/**
 * ❌ Please do not edit this class name
 */
export class InstrumentSocketClient {
  /**
   * ❌ Please do not edit this private property name
   */
  private _socket: WebSocket;

  /**
   * ✅ You can add more properties for the class here (if you want) 👇
   */

  private _subscriptions: Subscription[] = []
  private _queue: WebSocketClientMessageJson[] = []

  constructor() {
    /**
     * ❌ Please do not edit this private property assignment
     */
    this._socket = new WebSocket("ws://localhost:3000/ws");

    /**
     * ✅ You can edit from here down 👇
     */

    this._socket.addEventListener("open", this._onOpen.bind(this));
    this._socket.addEventListener("message", this._onMessage.bind(this));
  }

  public subscribe(subscription: Subscription) {
    this._subscriptions.push(subscription)

    const message: WebSocketClientMessageJson = {
      type: ClientMessageType.SUBSCRIBE,
      instrumentSymbols: subscription.symbols
    }

    this._sendMessageOrEnqueue(message)
  }

  private _sendMessageOrEnqueue(message: WebSocketClientMessageJson) {
    if (this._socket.readyState === WebSocketReadyState.OPEN) {
      this._socket.send(JSON.stringify(message))
    } else {
      this._queue.push(message)
    }
  }

  private _onOpen() {
    for (const message of this._queue) {
      this._socket.send(JSON.stringify(message))
    }

    this._queue = []
  }


  private _onMessage(message: MessageEvent<any>) {
    try {
      const data = JSON.parse(message.data) as WebSocketServerMessageJson;
      for (const subscription of this._subscriptions) {
        const instruments = data.instruments.filter(instrument => subscription.symbols.includes(instrument.code))
        subscription.handler(instruments);
      }
    } catch (e) {
      console.error('Invalid message structure', e);
    }
  }
}
