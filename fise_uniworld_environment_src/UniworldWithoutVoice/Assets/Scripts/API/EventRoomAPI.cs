using System;
using UnityEngine;
using UnityEngine.Networking;
using System.Threading.Tasks;

public class EventRoomAPI : MonoBehaviour
{
    static readonly string API_URL = "https://uniworld.azurewebsites.net/api/eventrooms";
    public static EventRoomDetail LoadedEventRoom;

    [Serializable]
    public class MeetingTable
    {
        public string title;
        public string type = "RoundMeetingTable";
        public string logoUrl;
        public string zoomUrl;
        public float posX;
        public float posY;

        [NonSerialized]
        public Texture2D logoTexture;
    }

    [Serializable]
    public class EventRoom
    {
        public string _id;
        public string title;
        public string eventDate;
        public string host;
    }

    [Serializable]
    public class EventRoomDetail
    {
        public string _id;
        public string title;
        public string eventDate;
        public MeetingTable[] meetingTables;
        public string background = "Default";
        public string scene = "Default";

        [NonSerialized]
        public Texture2D backgroundTexture;
    }

    public static async Task<EventRoom[]> GetEventRooms()
    {
        UnityWebRequest request = UnityWebRequest.Get(API_URL);
        await request.SendWebRequest();
        if (request.isNetworkError || request.isHttpError)
        {
            Debug.Log(request.error);
        }
        else
        {
            EventRoom[] results = JsonArrayUtility.FromJson<EventRoom>(request.downloadHandler.text);
            if (results != null && results.Length >= 1)
            {
                return results;
            }
        }
        return null;
    }

    public static bool IsVideoUrl(string str)
    {
        return Uri.IsWellFormedUriString(str, UriKind.Absolute) && str.EndsWith(".mp4");
    }

    public static bool IsImageUrl(string str)
    {
        return Uri.IsWellFormedUriString(str, UriKind.Absolute) && (str.EndsWith(".jpg") || str.EndsWith(".png") || str.EndsWith(".jpeg") || str.EndsWith(".gif"));
    }

    public static async Task<EventRoomDetail> GetEventRoomById(string id)
    {
        UnityWebRequest request = UnityWebRequest.Get(API_URL + "/" + id);
        await request.SendWebRequest();
        if (request.isNetworkError || request.isHttpError)
        {
            Debug.Log(request.error);
        }
        else
        {
            EventRoomDetail eventRoomDetail = JsonUtility.FromJson<EventRoomDetail>(request.downloadHandler.text);
            if(eventRoomDetail != null)
            {
                if(eventRoomDetail.meetingTables != null)
                {
                    foreach (MeetingTable table in eventRoomDetail.meetingTables)
                    {
                        UnityWebRequest textureRequest = UnityWebRequestTexture.GetTexture(table.logoUrl);
                        await textureRequest.SendWebRequest();
                        if (textureRequest.isNetworkError || textureRequest.isHttpError)
                        {
                            Debug.Log(textureRequest.error);
                        }
                        else
                        {
                            table.logoTexture = DownloadHandlerTexture.GetContent(textureRequest);
                        }
                    }
                }

                if (IsImageUrl(eventRoomDetail.background))
                {
                    UnityWebRequest textureRequest = UnityWebRequestTexture.GetTexture(eventRoomDetail.background);
                    await textureRequest.SendWebRequest();
                    if (textureRequest.isNetworkError || textureRequest.isHttpError)
                    {
                        Debug.Log(textureRequest.error);
                    }
                    else
                    {
                        eventRoomDetail.backgroundTexture = DownloadHandlerTexture.GetContent(textureRequest);
                    }
                }
                LoadedEventRoom = eventRoomDetail;
                return eventRoomDetail;
            }
        }
        return null;
    }
}