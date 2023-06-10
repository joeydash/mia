let giftTable = {
    data: {
        components: [{
            type: "table",
            id: "giftTable",
            title: "Gift",
            top_buttons: [],
            query_item: "whatsub_contacts_count",
            query: `query MyQuery {
                          whatsub_contacts_count(where: {status: {_eq: "claimed"}}, order_by: {}, limit: 100, offset: 0) {
                            user_id
                            whatsapp_contacts
                            status
                            created_at
                            updated_at
                            whatsub_share_gifts_availability{
                              gift_name
                            }
                            auth {
                              fullname
                              phone
                            }
                          }
                        }`,
            heads: [{
                key: "user_id", name: "UserId", type: "uuid"
            }, {
                key: "fullname",
                name: "Name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSort: true
            }, {
                key: "phone",
                name: "Phone",
                type: "string",
                showInList: true,
                nested_key: ["auth", "phone"],
                networkSort: true,
                link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '&text=👋 Hi ' + item.fullname + "! 🎉 As a valued customer of Subspace App, we've got an exciting offer just for you! Enjoy a FREE " + item.gift_name + "! 😍🌟 Don't wait too long, though, as the link expires within 24 hours. ⏳✨" + '" target="_blank">' + item.phone + '</a>'
                }
            }, {
                key: "gift_name",
                name: "Gift Name",
                type: "string",
                showInList: true,
                nested_key: ["whatsub_share_gifts_availability", "gift_name"],
                networkSort: true
            }, {
                key: "status",
                name: "Status",
                type: "option",
                loadOptionsFrom: ["created", "claimed", "delivered", "completed"],
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "whatsapp_contacts", name: "Whatsapp Contacts", type: "number", showInList: true, networkSort: true
            }, {
                key: "created_at",
                name: "Created At",
                type: "time",
                timeFormat: "h:mm a, DD/MM/YY",
                showInList: true,
                networkSort: true
            }, {
                key: "updated_at",
                name: "Updated At",
                type: "time",
                timeFormat: "h:mm a, DD/MM/YY",
                showInList: true,
                networkSort: true
            }],
            filters: [],
            sorts: [{key: "created_at", sort: "desc"}],
            dialogActions: [],
            saveActions: [{
                keys: ["user_id", "status"], mutation: `mutation MyMutation($status: String = "", $user_id: uuid = "") {
                                      update_whatsub_contacts_count(_set: {status: $status}, where: {user_id: {_eq: $user_id}}) {
                                        affected_rows
                                      }
                                    }`, mutation_item: "update_whatsub_contacts_count"
            }]
        }]
    }
}