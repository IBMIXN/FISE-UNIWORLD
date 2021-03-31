using System;
using UnityEngine;
using UnityEngine.Networking;
using System.Threading.Tasks;

public class LectureRoomAPI : MonoBehaviour
{
    static readonly string API_URL = "https://uniworld.azurewebsites.net/api/lecturerooms";
    public static LectureRoom[] LoadedLectureRooms;
    public static LectureRoom LoadedLectureRoom;

    [Serializable]
    public class LectureRoom
    {
        public string _id;
        public string title;
        public string module;
        public string lecturer;
        public string startTime;
        public string endTime;
        public int numSlides;
        public string firstSlideUrl;

        [NonSerialized]
        public Texture2D[] slides;
    }

    public static async Task<LectureRoom[]> GetLectureRooms()
    {
        UnityWebRequest request = UnityWebRequest.Get(API_URL);
        await request.SendWebRequest();
        if (request.isNetworkError || request.isHttpError)
        {
            Debug.Log(request.error);
        }
        else
        {
            LectureRoom[] results = JsonArrayUtility.FromJson<LectureRoom>(request.downloadHandler.text);
            if (results != null && results.Length >= 1)
            {
                LoadedLectureRooms = results;
                return results;
            }
        }
        return null;
    }

    public static async Task<LectureRoom> LoadLectureRoom(LectureRoom lectureRoom)
    {
        if (lectureRoom != null)
        {
            if (Uri.IsWellFormedUriString(lectureRoom.firstSlideUrl, UriKind.Absolute))
            {
                lectureRoom.slides = new Texture2D[lectureRoom.numSlides];
                for (int i = 0; i < lectureRoom.numSlides; i++)
                {
                    string ext = lectureRoom.firstSlideUrl.Substring(lectureRoom.firstSlideUrl.LastIndexOf('.'));
                    string currentSlideUrl = lectureRoom.firstSlideUrl.Substring(0, lectureRoom.firstSlideUrl.LastIndexOf('_') + 1) + i.ToString() + ext;
                    UnityWebRequest textureRequest = UnityWebRequestTexture.GetTexture(currentSlideUrl);
                    await textureRequest.SendWebRequest();
                    if (textureRequest.isNetworkError || textureRequest.isHttpError)
                    {
                        Debug.Log(textureRequest.error);
                    }
                    else
                    {
                        lectureRoom.slides[i] = DownloadHandlerTexture.GetContent(textureRequest);
                    }
                }
            }
            LoadedLectureRoom = lectureRoom;
            return lectureRoom;
        }
        return null;
    }

    public static async Task<LectureRoom> GetLectureRoomById(string id)
    {
        LectureRoom lectureRoom = null;

        if(LoadedLectureRooms.Length > 0)
        {
            foreach(LectureRoom room in LoadedLectureRooms)
            {
                if (room._id.Equals(id))
                {
                    lectureRoom = room;
                    break;
                }
            }
        }
        else
        {
            UnityWebRequest request = UnityWebRequest.Get(API_URL + "/" + id);
            await request.SendWebRequest();
            if (request.isNetworkError || request.isHttpError)
            {
                Debug.Log(request.error);
            }
            else
            {
                lectureRoom = JsonUtility.FromJson<LectureRoom>(request.downloadHandler.text);
            }
        }

        return await LoadLectureRoom(lectureRoom);
    }
}