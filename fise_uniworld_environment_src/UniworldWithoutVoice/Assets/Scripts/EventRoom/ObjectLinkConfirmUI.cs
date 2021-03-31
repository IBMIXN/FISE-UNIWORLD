using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

[RequireComponent(typeof(CanvasGroup))]
public class ObjectLinkConfirmUI : MonoBehaviour
{
    public static ObjectLinkConfirmUI Instance;
    private TextMeshProUGUI titleText;
    private CanvasGroup canvasGroup;
    public bool isDisplayed = false;
    public string url;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        titleText = GetComponentInChildren<TextMeshProUGUI>();
        canvasGroup = GetComponent<CanvasGroup>();
        Hide();
    }

    public static void Show(string title, string url)
    {
        if (Instance != null)
        {
            Instance.url = url;
            Instance.isDisplayed = true;
            Instance.titleText.text = title;
            CanvasUtils.Show(Instance.canvasGroup);
        }
    }

    public static void Hide()
    {
        if (Instance != null)
        {
            Instance.isDisplayed = false;
            CanvasUtils.Hide(Instance.canvasGroup);
        }
    }
}
