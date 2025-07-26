import os
import requests
import json
from google.cloud import pubsub_v1

YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")
PUBSUB_TOPIC = os.environ.get("PUBSUB_TOPIC")
PROJECT_ID = os.environ.get("GCP_PROJECT")

def fetch_and_publish(request):
    search_url = "https://www.googleapis.com/youtube/v3/videos"
    publisher = pubsub_v1.PublisherClient()
    topic_path = publisher.topic_path(PROJECT_ID, PUBSUB_TOPIC)

    published_count = 0
    page_token = None
    total_to_fetch = 200  # Adjust this as needed (max 200–500 realistically for "mostPopular")
    max_results_per_page = 50

    while published_count < total_to_fetch:
        params = {
            "part": "snippet,statistics,contentDetails,topicDetails",
            "chart": "mostPopular",
            "regionCode": "US",
            "maxResults": max_results_per_page,
            "key": YOUTUBE_API_KEY
        }

        if page_token:
            params["pageToken"] = page_token

        response = requests.get(search_url, params=params)
        data = response.json()

        if "items" not in data:
            break

        for item in data["items"]:
            snippet = item.get("snippet", {})
            statistics = item.get("statistics", {})
            content = item.get("contentDetails", {})
            thumbnails = snippet.get("thumbnails", {})
            topics = item.get("topicDetails", {})

            message = {
                "id": item.get("id"),
                "publishedAt": snippet.get("publishedAt"),
                "channelId": snippet.get("channelId"),
                "title": snippet.get("title"),
                "description": snippet.get("description"),
                "channelTitle": snippet.get("channelTitle"),
                "tags": snippet.get("tags", []),
                "categoryId": snippet.get("categoryId"),
                "liveBroadcastContent": snippet.get("liveBroadcastContent"),
                "defaultAudioLanguage": snippet.get("defaultAudioLanguage"),
                "thumbnail_default": thumbnails.get("default", {}).get("url"),
                "thumbnail_medium": thumbnails.get("medium", {}).get("url"),
                "thumbnail_high": thumbnails.get("high", {}).get("url"),
                "thumbnail_standard": thumbnails.get("standard", {}).get("url"),
                "thumbnail_maxres": thumbnails.get("maxres", {}).get("url"),
                "duration": content.get("duration"),
                "dimension": content.get("dimension"),
                "definition": content.get("definition"),
                "caption": content.get("caption"),
                "licensedContent": content.get("licensedContent"),
                "viewCount": int(statistics.get("viewCount", 0)),
                "likeCount": int(statistics.get("likeCount", 0)),
                "favoriteCount": int(statistics.get("favoriteCount", 0)),
                "commentCount": int(statistics.get("commentCount", 0)),
                "topicCategories": topics.get("topicCategories", [])
            }

            publisher.publish(topic_path, data=json.dumps(message).encode("utf-8"))
            published_count += 1

            if published_count >= total_to_fetch:
                break

        page_token = data.get("nextPageToken")
        if not page_token:
            break  # No more pages

    return f"Published {published_count} video(s) to Pub/Sub.", 200
