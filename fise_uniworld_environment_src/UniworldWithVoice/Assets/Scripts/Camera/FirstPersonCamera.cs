using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;
using UnityEngine.EventSystems;
using Photon.Pun;

public class FirstPersonCamera : MonoBehaviourPun
{
    private readonly float mouseSensitivity = 110f;
    public Transform playerTransform;

    public float rotationSpeed = 5f;
    private float xRot = 0f, yRot = 0f, yRotPlayer = 0f;
    private Quaternion cameraDefaultRot;

    void Start()
    {
        if (!photonView.IsMine)
        {
            Destroy(gameObject);
        }
        else
        {
            GetComponent<Camera>().enabled = true;
            GetComponent<AudioListener>().enabled = true;
            if(SceneManager.GetActiveScene().name != "EventHall")
            {
                SceneFader.StartFadeInScene();
            }
        }
        cameraDefaultRot = transform.localRotation;
        yRotPlayer = -playerTransform.localRotation.y;
    }

    void MoveCamera()
    {
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * Time.deltaTime;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * Time.deltaTime;

        xRot -= mouseY;
        xRot = Mathf.Clamp(xRot, -90f, 90f);

        yRot += mouseX;
        yRot = Mathf.Clamp(yRot, -90, 90f);

        transform.localRotation = Quaternion.Euler(xRot, yRot, 0);
    }

    void MovePlayerAndCamera()
    {
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * Time.deltaTime;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * Time.deltaTime;

        xRot -= mouseY;
        xRot = Mathf.Clamp(xRot, -90f, 90f);

        yRotPlayer += mouseX;

        transform.localRotation = Quaternion.Euler(xRot, 0, 0);
        playerTransform.localRotation = Quaternion.Euler(0, yRotPlayer, 0);
    }

    void ResetCameraRotation() 
    {
        xRot = Mathf.LerpAngle(xRot, 0f, Time.deltaTime * rotationSpeed);
        yRot = Mathf.LerpAngle(yRot, 0f, Time.deltaTime * rotationSpeed);
        yRotPlayer = playerTransform.localRotation.eulerAngles.y;
        transform.localRotation = Quaternion.Slerp(transform.localRotation, cameraDefaultRot, Time.deltaTime * rotationSpeed);
    }

    public static bool CheckMouseOverUI()
    {
        PointerEventData eventDataCurrentPosition = new PointerEventData(EventSystem.current);
        eventDataCurrentPosition.position = new Vector2(Input.mousePosition.x, Input.mousePosition.y);
        List<RaycastResult> results = new List<RaycastResult>();
        if(EventSystem.current != null)
        {
            EventSystem.current.RaycastAll(eventDataCurrentPosition, results);
        }
        return results.Count > 0;
    }

    void UpdateCursor()
    {
        // WebGL build handles cursor locking separately with Javascript
        // due to defered event handling (https://docs.unity3d.com/Manual/webgl-cursorfullscreen.html)
        // This function is only required for cursor locking in the Unity Editor playmode
#if UNITY_EDITOR
        if (Input.GetMouseButton(1))
        {
            Cursor.lockState = CursorLockMode.Locked;
        }
        else
        {
            Cursor.lockState = CursorLockMode.None;
        }
    #endif
    }

    void Update()
    {
        UpdateCursor();

        if (Input.GetMouseButton(1))
        {
            PlayerController.SetCamRunForward(true);
            MovePlayerAndCamera();
        }
        else if(Input.GetMouseButton(0) && !CheckMouseOverUI())
        {
            PlayerController.SetCamRunForward(false);
            MoveCamera();
        }
        else
        {
            PlayerController.SetCamRunForward(false);
            ResetCameraRotation();
        }
    }
}
