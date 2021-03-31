using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class AvatarSelector : MonoBehaviour
{
    private Dictionary<string, GameObject> avatars;
    public TextMeshProUGUI avatarValueText;

    private void Awake()
    {
        avatars = new Dictionary<string, GameObject>();
    }

    public void SelectAvatar(string name)
    {
        ClearSelection();
        avatars[name].GetComponentInChildren<Light>().enabled = true;
        avatars[name].GetComponent<Animator>().SetTrigger("Waving");
        avatarValueText.text = name;
        PlayerManager.SelectAvatar(name);
    }

    public void ClearSelection()
    {
        foreach(KeyValuePair<string, GameObject> avatar in avatars)
        {
            avatar.Value.GetComponentInChildren<Light>().enabled = false;
        }
    }

    void Start()
    {
        foreach (Transform child in transform)
        {
            child.LookAt(new Vector3(Camera.main.transform.position.x, child.position.y, Camera.main.transform.position.z));
            child.gameObject.GetComponentInChildren<Light>().enabled = false;
            avatars.Add(child.gameObject.name, child.gameObject);
        }
        SelectAvatar("Y Bot");
    }

    private void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            RaycastHit hit;
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out hit))
            {
                Debug.Log(hit.collider.transform.parent.tag);
                if (hit.collider != null && hit.collider.transform.parent.CompareTag("Player"))
                {
                    SelectAvatar(hit.collider.transform.parent.gameObject.name);
                }
            }
        }
    }
}
