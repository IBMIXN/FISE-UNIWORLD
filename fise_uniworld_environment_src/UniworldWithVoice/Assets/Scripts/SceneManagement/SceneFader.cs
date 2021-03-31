using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using TMPro;

public class SceneFader : MonoBehaviour
{
    public static SceneFader Instance;
    private RawImage fadeImage;
    private TextMeshProUGUI fadeText;
    public float fadeSpeed = 1.2f;

    private void Awake()
    {
        if (!Instance)
        {
            DontDestroyOnLoad(gameObject);
            Instance = this;
            fadeImage = GetComponentInChildren<RawImage>();
            fadeImage.enabled = false;
            fadeText = GetComponentInChildren<TextMeshProUGUI>();
            fadeText.enabled = false;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public static void HideScene()
    {
        if (!Instance.fadeImage.enabled)
        {
            Instance.fadeImage.color = new Color(Instance.fadeImage.color.r, Instance.fadeImage.color.g, Instance.fadeImage.color.b, 1f);
            Instance.fadeText.color = new Color(Instance.fadeText.color.r, Instance.fadeText.color.g, Instance.fadeText.color.b, 1f);
            Instance.fadeImage.enabled = true;
            Instance.fadeText.enabled = true;
        }
    }

    public static void StartFadeInScene()
    {
        Instance.StartCoroutine(Instance.FadeInScene());
    }

    private IEnumerator FadeInScene()
    {
        fadeImage.enabled = true;
        fadeText.enabled = true;
        float alpha = 1;
        while (alpha >= 0)
        {
            SetAlpha(ref alpha, false);
            yield return null;
        }
        fadeImage.enabled = false;
        fadeText.enabled = false;
    }

    private void SetAlpha(ref float alpha, bool fadeIn)
    {
        fadeImage.color = new Color(fadeImage.color.r, fadeImage.color.g, fadeImage.color.b, alpha);
        fadeText.color = new Color(fadeText.color.r, fadeText.color.g, fadeText.color.b, alpha);
        alpha += fadeSpeed * Time.deltaTime * (fadeIn ? 1 : -1);
    }
}