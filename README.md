# Azure Simple Messaging System

## Overview

This project provides a simple messaging system architecture for Viber, Telegram, and NgTrend.

## API Endpoint

Access the orchestrator via the following endpoint:

```
http://localhost:7071/api/orchestrators/{orchestratorName}
```

## Supported Orchestrators

- Viber
- TWILIO
- SMS

## Payload Structure

The payload should be structured as follows:

```json
{
  "inArguments": [
    {
      "version": "2.0",
      "config": {
        // Configuration depends on the orchestrator
      },
      "configured": [1, 2, 3],
      "row": "3",
      "interactionId": "b42e17a9-bab4-437f-8912-38a0017ae495"
    }
  ],
  "outArguments": [],
  "activityObjectID": "4944bf7d-2a02-4a42-98f5-9d429307f044",
  "journeyId": "a054d9ae-5f40-44b2-9d19-eb52c80279ea",
  "activityId": "4944bf7d-2a02-4a42-98f5-9d429307f044",
  "definitionInstanceId": "ec1417b2-0d71-4b44-958e-a641a1a56dd2",
  "activityInstanceId": "212bda26-83c5-4510-aaba-dd71ad254331",
  "keyValue": "123456789",
  "mode": 0
}
```

TWILIO config:

```json
{
  "selectedField": "48333222111",
  "message": "Hello from IQOS!",
  "campaignId": "test123",
  "market": "DE",
  "platform": "twilio"
}
```

VIBER config:

```json
{
  "type": "TEXT_ONLY",
  "campaignId": "campaign-13",
  "appIdSelected": "19313",
  "mid": 100039164,
  "market": "MX",
  "message": "a message for our viber user",
  "selectedField": "49555666777",
  "selectedMessageType": "transaction"
}


{
  "type": "IMAGE_ONLY",
  "campaignId": "campaign-13",
  "appIdSelected": "19313",
  "mid": 100039164,
  "market":"MX",
  "imageurl": "https://image-url.png",
  "selectedField": "49555666777",
  "selectedMessageType": "transaction"
}

{
  "type": "TEXT_IMAGE_BUTTON",
  "campaignId": "campaign-13",
  "appIdSelected": "19313",
  "mid": 100039164,
  "market":"MX",
  "message": "a message for our viber user.",
  "imageurl": "https://image-url.png",
  "button": "Go to page",
  "action": "https://action-url.com",
  "selectedField": "49555666777",
  "selectedMessageType": "transaction"
}


{
  "type": "TEXT_BUTTON",
  "campaignId": "campaign-13",
  "appIdSelected": "19313",
  "mid": 100039164,
  "market":"MX",
  "message": "a message for our viber user.",
  "button": "Go to page",
  "action": "https://action-url.com",
  "selectedField": "49555666777",
  "selectedMessageType": "transaction"
}
```

TEXT config

```json
{
  "selectedField": "48333222111",
  "message": "Hello from IQOS!",
  "campaignId": "test123",
  "market": "PH",
  "platform": "m360",
  "senderId": "PMI",
  "type": "TextMessage",
  "mid": "100039164"
}

{
  "selectedField": "48333222111",
  "message": "Hello from IQOS!",
  "campaignId": "test123",
  "market": "PS",
  "platform": "infobip",
  "senderId": "PMI",
  "type": "TextMessage",
  "mid": "100039164"
}
```
