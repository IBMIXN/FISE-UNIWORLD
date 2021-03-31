using UnityEngine;
using TMPro;

public class PlayerUI : MonoBehaviour
{
    private TextMeshProUGUI playerNameText;
    private PlayerController target;

    private float characterControllerHeight = 0f;
    private Transform targetTransform;
    private SkinnedMeshRenderer targetRenderer;
    private CanvasGroup canvasGroup;
    private Vector3 targetPosition;

    private void Awake()
    {
        canvasGroup = GetComponent<CanvasGroup>();
        playerNameText = GetComponentInChildren<TextMeshProUGUI>();
        transform.SetParent(PlayerUICanvas.Instance.gameObject.GetComponent<Transform>(), false);
    }

    public void SetTarget(PlayerController target)
    {
        this.target = target;
        if (playerNameText != null)
        {
            playerNameText.text = target.photonView.Owner.NickName;
        }
        targetTransform = target.GetComponent<Transform>();
        targetRenderer = target.GetComponentInChildren<SkinnedMeshRenderer>();
        CharacterController characterController = target.GetComponent<CharacterController>();
        if (characterController != null)
        {
            characterControllerHeight = characterController.height;
        }
    }

    private void Update()
    {
        if (target == null)
        {
            Destroy(gameObject);
        }
    }

    private void LateUpdate()
    {
        // Prevent displaying the UI when occluded from camera view and avoid potential bugs with seeing the UI, but not the player itself.
        if (targetRenderer != null)
        {
            canvasGroup.alpha = targetRenderer.isVisible ? 1f : 0f;
        }

        // Follow the Target GameObject on screen.
        if (targetTransform != null)
        {
            targetPosition = new Vector3(targetTransform.position.x, targetTransform.position.y + characterControllerHeight + 0.2f, targetTransform.position.z);
            if(Camera.main != null)
            {
                transform.position = Camera.main.WorldToScreenPoint(targetPosition);
            }
        }
    }
}
