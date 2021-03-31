using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PresentationControllerUI : MonoBehaviour
{
    public static PresentationControllerUI Instance;
    private CanvasGroup canvasGroup;
    public bool isDisplayed = false;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        canvasGroup = GetComponent<CanvasGroup>();
        Hide();
    }

    public static void Show()
    {
        Instance.isDisplayed = true;
        Instance.canvasGroup.alpha = 1f;
        Instance.canvasGroup.blocksRaycasts = true;
    }

    public static void Hide()
    {
        Instance.isDisplayed = false;
        Instance.canvasGroup.alpha = 0f;
        Instance.canvasGroup.blocksRaycasts = false;
    }
}
