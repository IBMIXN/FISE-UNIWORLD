using UnityEngine;

[RequireComponent(typeof(ObjectLink))]
public class MeetingTable : MonoBehaviour
{
    private MeetingSignPlate signPlate;
    private ObjectLink objectLink;

    private void Awake()
    {
        objectLink = GetComponent<ObjectLink>();
        signPlate = GetComponentInChildren<MeetingSignPlate>();
    }

    public void SetTable(EventRoomAPI.MeetingTable table)
    {
        signPlate.SetLabel(table.title);
        signPlate.SetLogo(table.logoTexture);
        objectLink.url = table.zoomUrl;
        objectLink.title = "Do you wish to join " + table.title + " ? ";
    }
}
