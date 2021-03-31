using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ObjectLink : MonoBehaviour
{
    public float triggerDistance = 2.7f;
    public string title;
    public string url;
    private bool isDisplaying = false;

    void Update()
    {
        if (PlayerController.LocalInstance != null && ObjectLinkConfirmUI.Instance != null)
        {
            float dist = Vector3.Distance(PlayerController.LocalInstance.transform.position, transform.position);
            if (!isDisplaying && dist < triggerDistance)
            {
                isDisplaying = true;
                ObjectLinkConfirmUI.Show(title, url);
            }
            if (isDisplaying && dist >= triggerDistance)
            {
                isDisplaying = false;
                ObjectLinkConfirmUI.Hide();
            }
        }
    }
}
