using UnityEngine;
using UnityEngine.UI;
using Photon.Pun;
using PhotonHashtable = ExitGames.Client.Photon.Hashtable;

[RequireComponent(typeof(Collider))]
public class PresentationSlide : MonoBehaviourPunCallbacks
{
    public static PresentationSlide Instance;
    public bool loadFromAPI = true;
    public bool networked = true;
    public Texture2D[] slides;
    public int currentSlideIndex = 0;
    public int numSlides = 1;

    private RawImage slideImage;
    private bool displayingUI = false;
    public float MIN_DIST = 6f;

    private bool slidesLoadedFromAPI = false;

    private void Awake()
    {
        Instance = this;
        slideImage = GetComponentInChildren<RawImage>();
    }

    private void Start()
    {
        if (!loadFromAPI)
        {
            SetSlide(0);
        }
    }

    private void RetrieveSlidesFromAPI(LectureRoomAPI.LectureRoom lectureRoom)
    {
        numSlides = lectureRoom.numSlides;
        slides = lectureRoom.slides;
        object prop = PhotonNetwork.CurrentRoom.CustomProperties["currentSlideIndex"];
        if (prop != null)
        {
            currentSlideIndex = (int)prop;
        }
        SetSlide(currentSlideIndex);
    }

    private PhotonHashtable GetRoomProps()
    {
        PhotonHashtable roomProps = new PhotonHashtable();
        roomProps.Add("currentSlideIndex", currentSlideIndex);
        return roomProps;
    }

    private void SetSlide(int newIndex)
    {
        currentSlideIndex = newIndex;
        slideImage.texture = slides[currentSlideIndex];
        ZoomedPresentationUI.SetSlide(slideImage.texture);
    }

    public void NextSlide()
    {
        SetSlide(currentSlideIndex < numSlides - 1 ? currentSlideIndex + 1 : currentSlideIndex);
        if (networked)
        {
            PhotonNetwork.CurrentRoom.SetCustomProperties(GetRoomProps());
        }
    }

    public void PrevSlide()
    {
        SetSlide(currentSlideIndex > 0 ? currentSlideIndex - 1 : currentSlideIndex);
        if (networked)
        {
            PhotonNetwork.CurrentRoom.SetCustomProperties(GetRoomProps());
        }
    }

    public override void OnRoomPropertiesUpdate(PhotonHashtable newProps)
    {
        SetSlide((int) newProps["currentSlideIndex"]);
    }

    void Update()
    {
        if(!slidesLoadedFromAPI && loadFromAPI && LectureRoomAPI.LoadedLectureRoom != null)
        {
            RetrieveSlidesFromAPI(LectureRoomAPI.LoadedLectureRoom);
            slidesLoadedFromAPI = true;
        }

        if (PlayerController.LocalInstance != null && PresentationControllerUI.Instance != null)
        {
            float dist = Vector3.Distance(PlayerController.LocalInstance.transform.position, transform.position);
            if (!displayingUI && dist < MIN_DIST)
            {
                displayingUI = true;
                PresentationControllerUI.Show();
            }
            if (displayingUI && dist >= MIN_DIST)
            {
                displayingUI = false;
                PresentationControllerUI.Hide();
            }
        }

        if (Input.GetMouseButtonDown(0))
        {
            RaycastHit hit;
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out hit))
            {
                if (hit.collider != null && hit.collider.gameObject.Equals(gameObject))
                {
                    ZoomedPresentationUI.Show();
                }
            }
        }
    }
}
