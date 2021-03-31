using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ZoomedPresentationUI : MonoBehaviour
{
    public static ZoomedPresentationUI Instance;
    private CanvasGroup canvasGroup;
    private Button closeButton;
    private RawImage slideImage;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        canvasGroup = GetComponent<CanvasGroup>();
        closeButton = GetComponentInChildren<Button>();
        closeButton.onClick.AddListener(Hide);
        slideImage = GetComponentInChildren<RawImage>();
        Hide();
    }

    public static void Show()
    {
        Instance.canvasGroup.alpha = 1f;
        Instance.canvasGroup.blocksRaycasts = true;
    }

    public static void Hide()
    {
        Instance.canvasGroup.alpha = 0f;
        Instance.canvasGroup.blocksRaycasts = false;
    }

    public static void SetSlide(Texture slideTexture)
    {
        Instance.slideImage.texture = slideTexture;
    }
}
