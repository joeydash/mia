let adminNavs = {
    navs: [{
        name: "Account", sections: [{
            name: "Users", path: "/subspace/users"
        }, {
            name: "User Subscriptions", path: "/subspace/rooms"
        }, {
            name: "Transactions", path: "/subspace/wallet"
        }, {
            name: "Balances", path: "/subspace/negative"
        }, {
            name: "Coupons", path: "/subspace/coupons"
        }]
    }, {
        name: "Subscriptions", sections: [{
            name: "Plans", path: "/subspace/plans"
        }, {
            name: "Services", path: "/subspace/services"
        }, {
            name: "Product Coupons", path: "/subspace/productCoupons"
        }]
    }, {
        name: "Search Logs", sections: [{
            name: "All Search Logs", path: "/subspace/searchLogs"
        }, {
            name: "Trending Search Logs", path: "/subspace/trendingSearchLogs"
        }]
    }, {
        name: "Quality Assurance", sections: [{
            name: "Ratings", path: "/subspace/ratings"
        }, {
            name: "Leave Requests", path: "/subspace/leaveRequests"
        }, {
            name: "Spam Reports", path: "/subspace/spams"
        }]
    }, {
        name: "Admin", sections: [{
            name: "Auto Reply", path: "/subspace/autoReplyTable"
        }, {
            name: "Admin Logs", path: "/subspace/adminLogs"
        }, {
            name: "Short Links", path: "/subspace/shortLinksTable"
        }, {
            name: "Share Gifts", path: "/subspace/share"
        }]
    }]
};

let users = {
    data: {
        components: [{
            type: "table", id: "usersTable", title: "Users", query_item: "auth", query: `query getUsersInfo {
                      auth(order_by: {}, where: {}, limit: 100, offset: 0) {
                        id
                        created_at
                        email
                        fullname
                        phone
                        dp
                        username
                        is_deleted
                        is_blocked
                        is_cooldown
                        transactionChargesPrices
                        transactionChargesPercentage
                        whatsub_fcm_tokens(order_by: {updated_at: desc}, limit: 1) {
                          updated_at
                        }
                      }
                    }`, heads: [{
                key: "id", name: "Id", type: "uuid", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "fullname",
                name: "Name",
                type: "string",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "username",
                name: "User Name",
                type: "string",
                canEdit: true,
                showInList: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "phone", name: "Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '&text=Hi, I am Manoj from Subspace App. You have left your sign up process in the middle. Well, are you facing any technical issues?" target="_blank">' + item.phone + '</a>'
                }, networkSearch: true, networkSort: true
            }, {
                key: "email",
                name: "Email",
                type: "string",
                canEdit: true,
                showInList: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "dp", name: "Profile Pic", canEdit: true, type: "string", uploadImageData: {
                    destinationFolder: ["profiles"], cropperOptions: {
                        options: {
                            aspectRatio: 1
                        }
                    }
                }
            }, {
                key: "is_cooldown",
                name: "Cool Down",
                type: "boolean",
                canEdit: true,
                showInList: true,
                loadOptionsFrom: [true, false],
                networkSearch: true,
                networkSort: true
            }, {
                key: "is_deleted",
                name: "Deleted Account",
                type: "boolean",
                canEdit: true,
                showInList: true,
                loadOptionsFrom: [true, false],
                networkSearch: true,
                networkSort: true
            }, {
                key: "is_blocked",
                name: "Blocked Account",
                type: "boolean",
                canEdit: true,
                showInList: true,
                loadOptionsFrom: [true, false],
                networkSearch: true,
                networkSort: true
            }, {
                key: "created_at",
                name: "Created At",
                type: "time",
                timeFormat: "h:mm a, DD/MM/YY",
                showInList: true,
                networkSort: true
            }, {
                key: "last_opened",
                name: "Last Opened",
                type: "time",
                timeFormat: "h:mm a, DD/MM/YY",
                showInList: true,
                nested_key: ["whatsub_fcm_tokens", 0, "updated_at"]
            }, {
                key: "transactionChargesPrices",
                name: "Withdraw Fee Min (* 100 ₹)",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "transactionChargesPercentage",
                name: "Withdraw Fee % (* 1000)",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }], filters: [{
                key: "created_at", match_type: "_gte", data_type: "string"
            }, {
                key: "id", match_type: "_eq", data_type: "uuid"
            }], sorts: [{key: "created_at", sort: "desc"}], dialogActions: [], saveActions: [{
                keys: ["id", "is_deleted", "is_blocked", "is_cooldown", "email", "username", "fullname", "transactionChargesPrices", "transactionChargesPercentage", "dp"],
                mutation: `mutation updateUser($is_cooldown: Boolean = false, $is_blocked: Boolean = false, $is_deleted: Boolean = false, $id: uuid = "", $email: String = "", $username: String = "", $fullname: String = "", $transactionChargesPercentage: Int = 0, $transactionChargesPrices: Int = 0, $dp: String = "") {
                              update_auth(_set: {is_cooldown: $is_cooldown, is_blocked: $is_blocked, is_deleted: $is_deleted, email: $email, username: $username, fullname: $fullname, transactionChargesPercentage: $transactionChargesPercentage, transactionChargesPrices: $transactionChargesPrices, dp: $dp}, where: {id: {_eq: $id}}) {
                                affected_rows
                              }
                            }`,
                mutation_item: "update_auth"
            }]

        }]
    }
};
let rooms = {
    data: {
        components: [{
            type: "table",
            id: "roomsTable",
            title: "Rooms",
            top_buttons: [{
                name: "Add User To Room", buttonType: "dark", input: [{
                    key: "room_id",
                    name: "Room Id",
                    type: "uuid",
                    canEdit: true,
                    placeholder: "a79566f8-9cbc-4287-894d-e5f0270761ae"
                }, {
                    key: "user_id",
                    name: "User Id",
                    type: "uuid",
                    canEdit: true,
                    placeholder: "a79566f9-9cbc-4287-894d-e5f0270761ae"
                }], dialogActions: [{
                    name: "Add User", buttonType: "dark", allMutations: [{
                        mutation_item: "w_addUserToRoomManual", mutation: `mutation MyMutation($room_id: uuid = "", $user_id: uuid = "") {
                                      w_addUserToRoomManual(request: {room_id: $room_id, user_id: $user_id}) {
                                        affected_rows
                                      }
                                    }`, keys: ["user_id", "room_id"]
                    }],
                }]
            }],
            query_item: "whatsub_users_subscription",
            query: `query MyQuery {
                          whatsub_users_subscription(where: {}, order_by: {}, limit: 100, offset: 0) {
                            id
                            plan
                            service_name
                            room_id
                            user_id
                            share_limit
                            type
                            expiring_at
                            expiring_at_from_model
                            created_at
                            expiry_image
                            operation_status
                            status
                            hide_limit
                            whatsub_room {
                              is_public
                              is_verified
                              status
                              limit
                              auth {
                                fullname
                                phone
                              }
                            }
                            auth {
                              fullname
                              phone
                              whatsub_admin_ratings_aggregate{
                                aggregate{
                                  count
                                }
                                aggregate{
                                  avg{
                                    rating
                                  }
                                }
                              }
                            }
                          }
                        }`,
            heads: [{
                key: "operation_status",
                name: "O Status",
                type: "option",
                loadOptionsFrom: ["Resolved", "Declined (Wrong Expiry Image)", "Messaged (Awaiting Response)", "Whatsapp Number Not Found", "Notification For Repay Sent", "Notification For Renewal Sent", "Expiry Behind Today", "Called (Awaiting Response)", "Whatsapp Number Not Found", "Declined By User", "Resolved (Wrong Expiry)", "Pending", "Declined"],
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "created_at",
                name: "Created",
                type: "time",
                timeFormat: "h:mm a, DD/MM/YY",
                showInList: true,
                networkSort: true
            }, {
                key: "expiring_at",
                name: "Expiring",
                type: "time",
                timeFormat: "DD/MM/YY",
                showInList: true,
                canEdit: true,
                link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '&text=Hi ' + item.fullname + ', I am Manoj from Subspace App. Your ' + item.service_name + ' ' + item.plan + ' is expiring ' + moment(item.expiring_at).add(1, 'days').fromNow() + '. ' + ((item.room_id !== null) ? ((item.type === 'admin') ? ((item.status === 'stop') ? 'You have requested to stop the subscription. If you want to continue the subscription and you think it is a mistake contact us otherwise ignore this message' : 'Your expiration date will be updated automatically. If you decide not to share the subscription, you can cancel it through the app.') : 'To continue using your subscription, please add money to your subspace wallet before it expires.') : '') + '" target="_blank">' + moment(item.expiring_at).format("DD/MM/YY") + '</a>'
                },
                networkSort: true
            }, {
                key: "type",
                name: "Type",
                type: "option",
                showInList: true,
                loadOptionsFrom: ["admin", "member"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "service_name",
                name: "Service",
                type: "string",
                showInList: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "plan", name: "Plan", type: "string", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "fullname",
                name: "Name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "phone", name: "Phone", type: "string", showInList: true, nested_key: ["auth", "phone"], link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '&text=Hi ' + item.fullname + ', I am Manoj from Subspace app. You have tracked  ' + item.service_name + ' ' + item.plan + ', Do you want to share and earn money from it?" target="_blank">' + item.phone + '</a>'
                }, networkSearch: true, networkSort: true
            }, {
                key: "admin_fullname",
                name: "Admin Name",
                type: "string",
                showInList: true,
                nested_key: ["whatsub_room", "auth", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "admin_phone",
                name: "Admin Phone",
                type: "string",
                showInList: true,
                nested_key: ["whatsub_room", "auth", "phone"],
                link: {
                    type: "redirect",
                    pathFunction: (item) => item.admin_phone === null ? "" : '<a href="https://api.whatsapp.com/send?phone=91' + item.admin_phone + '&text=Hi ' + item.admin_fullname + ', I am Manoj from Subspace app. You have tracked  ' + item.service_name + ' ' + item.plan + ', Do you want to share and earn money from it?" target="_blank">' + item.admin_phone + '</a>'
                },
                networkSearch: true,
                networkSort: true
            }, {
                key: "average_rating",
                name: "Average Rating",
                type: "number",
                nested_key: ["auth", "whatsub_admin_ratings_aggregate", "aggregate", "avg", "rating"],
            }, {
                key: "number_of_ratings",
                name: "Number Of Ratings",
                type: "number",
                nested_key: ["auth", "whatsub_admin_ratings_aggregate", "aggregate", "count"],
            }, {
                key: "is_verified",
                name: "Verified",
                type: "boolean",
                showInList: true,
                loadOptionsFrom: [true, false],
                nested_key: ["whatsub_room", "is_verified"],
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "is_public",
                name: "Public",
                type: "boolean",
                loadOptionsFrom: [true, false],
                nested_key: ["whatsub_room", "is_public"],
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "status",
                name: "Subscription Status",
                type: "option",
                loadOptionsFrom: ["active", "inactive", "stop"],
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "room_status",
                name: "Room Status",
                type: "option",
                loadOptionsFrom: ["active", "inactive"],
                nested_key: ["whatsub_room", "status"],
                canEdit: true
            }, {key: "share_limit", name: "Shares", type: "number", canEdit: true}, {
                key: "limit", name: "Group Limit", type: "number", nested_key: ["whatsub_room", "limit"], canEdit: true
            }, {key: "hide_limit", name: "Hide Limit", type: "number", canEdit: true}, {
                key: "expiring_at_from_model",
                name: "Expiring (Detected)",
                type: "time",
                timeFormat: "DD/MM/YY",
                showInList: true,
                canEdit: false,
                networkSort: true
            }, {
                key: "expiry_image", name: "Expiry Image", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => item.expiry_image === null ? "" : '<a href="' + item.expiry_image + '" target="_blank">' + item.expiry_image + '</a>'
                }, networkSearch: true, networkSort: true
            }, {
                key: "room_id", name: "Room Id", type: "uuid", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "user_id", name: "User Id", type: "uuid"
            }, {key: "id", name: "Id", type: "uuid"}],
            filters: [{key: "expiring_at", match_type: "_eq", data_type: "string"}, {
                key: "created_at", match_type: "_gte", data_type: "string"
            }, {
                key: "id", match_type: "_eq", data_type: "uuid"
            }],
            sorts: [{key: "created_at", sort: "desc"}],
            dialogActions: [{
                name: "Remove Partial",
                buttonType: "danger",
                showIf: (item) => item.type === 'member' && item.room_id !== null && item.user_id !== null,
                allMutations: [{
                    mutation_item: "w_removeUserFromGroupPartial", mutation: `mutation removeUserFromGroupPartial($room_id: uuid = "", $user_id: uuid = "") {
                                  w_removeUserFromGroupPartial(request: {room_id: $room_id, user_id: $user_id}) {
                                    affected_rows
                                  }
                                }`, keys: ["room_id", "user_id"]
                }],
            }, {
                name: "Remove Complete",
                buttonType: "danger",
                showIf: (item) => item.type === 'member' && item.room_id !== null && item.user_id !== null,
                allMutations: [{
                    mutation_item: "w_removeUserFromGroupComplete", mutation: `mutation removeUserFromGroupComplete($room_id: uuid = "", $user_id: uuid = "") {
                                  w_removeUserFromGroupComplete(request: {room_id: $room_id, user_id: $user_id}) {
                                    affected_rows
                                  }
                                }`, keys: ["room_id", "user_id"]
                }],
            }],
            saveActions: [{
                keys: ["room_id", "limit", "is_verified", "is_public", "room_status"], mutation: `mutation MyMutation($room_id: uuid = "", $limit: Int = 10, $is_verified: Boolean = false, $is_public: Boolean = false, $room_status: String = "") {
                          update_whatsub_rooms(where: {id: {_eq: $room_id}}, _set: {is_verified: $is_verified, is_public: $is_public, status: $room_status, limit: $limit}) {
                            affected_rows
                          }
                        }`, mutation_item: "update_whatsub_rooms"
            }, {
                keys: ["share_limit", "id", "expiring_at", "operation_status", "status", "hide_limit"], mutation: `mutation MyMutation($share_limit: Int = 10, $id: uuid = "", $expiring_at: date = "", $operation_status: String = "", $status: String = "", $hide_limit: Int = 10) {
  update_whatsub_users_subscription(_set: {share_limit: $share_limit, expiring_at: $expiring_at, operation_status: $operation_status, status: $status, hide_limit: $hide_limit}, where: {id: {_eq: $id}}) {
    affected_rows
  }
}`, mutation_item: "update_whatsub_users_subscription"
            }]
        }]
    }
};
let wallet = {
    data: {
        components: [{
            type: "table", id: "walletTable", title: "Wallet", query_item: "whatsub_wallet", query: `query MyQuery {
              whatsub_wallet(order_by: {}, where: {}, limit: 100, offset: 0) {
                id
                user_id
                amount
                created_at
                updated_at
                auth {
                  fullname
                  email
                  phone
                }
                purpose
                metadata
                payment_id
              }
            }`, heads: [{
                key: "bank_qr", name: "Bank QR", type: "qr", dataFunction: (item) => {
                    if (item.purpose === 'Processing withdrawal') {
                        if (item.metadata.payout_type !== undefined && item.metadata.payout_type === 'upi') return 'upi://pay?pa=' + item.metadata.upi_id + '&pn=' + item.metadata.account_name + '&am=' + item.metadata.withdraw_amount / 100 + '&tn=Subspace Payment&cu=INR';
                        if (item.metadata.payout_type !== undefined && item.metadata.payout_type === 'bank') return 'upi://pay?pa=' + item.metadata.bank_account_number + '@' + item.metadata.ifsc + '.ifsc.npci&pn=' + item.metadata.account_name + '&am=' + item.metadata.withdraw_amount / 100 + '&tn=Subspace Payment&cu=INR';
                    }
                }
            }, {
                key: "id", name: "Id", type: "uuid", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "user_id", name: "User Id", type: "uuid", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "fullname",
                name: "Name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "phone", name: "Phone", type: "string", showInList: true, nested_key: ["auth", "phone"], link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '" target="_blank">' + item.phone + '</a>'
                }, networkSearch: true, networkSort: true
            }, {key: "Email", name: "Email", type: "string", nested_key: ["auth", "email"]}, {
                key: "amount", name: "Amount", type: "number", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "purpose",
                name: "Purpose",
                type: "string",
                showInList: true,
                networkSearch: true,
                networkSort: true
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
            }, {key: "payment_id", name: "payment Id", type: "uuid"}, {
                key: "metadata", name: "Metadata", type: "object"
            }], filters: [{
                key: "created_at", match_type: "_gte", data_type: "string"
            }], sorts: [{key: "created_at", sort: "desc"}], dialogActions: [{
                showIf: (item) => (item.purpose === 'Processing withdrawal' || item.purpose?.includes('Pending')),
                name: "Process withdrawal",
                buttonType: "danger",
                allMutations: [{
                    mutation_item: "w_withdrawUpdate", mutation: `mutation withdrawUpdate($id: uuid = "") {
                                  w_withdrawUpdate(request: {wallet_id: $id}) {
                                    affected_rows
                                  }
                                }`, keys: ["id"]
                }],
            }, {
                showIf: (item) => (item.purpose?.includes('Pending')),
                name: "Processing",
                buttonType: "danger",
                allMutations: [{
                    mutation_item: "update_whatsub_wallet", mutation: `mutation MyMutation($id: uuid) {
                        update_whatsub_wallet(where: {id: {_eq: $id}}, _set: {purpose: "Processing withdrawal"}) {
                          affected_rows
                        }
                      }`, keys: ["id"]
                }],
            }, {
                showIf: (item) => (item.purpose?.includes('Pending')),
                name: "Update upi",
                buttonType: "danger",
                allMutations: [{
                    mutation_item: "w_updateUpi", mutation: `mutation updateUpi($user_id:uuid!,$id:uuid!){
                        w_updateUpi(request:{user_id:$user_id,trans_id:$id}){
                          affected_rows
                        }
                      }`, keys: ["user_id", "id"]
                }],
            }, {
                showIf: (item) => (item.purpose === 'Processing refund'),
                name: "Processing withdraw",
                buttonType: "danger",
                allMutations: [{
                    mutation_item: "update_whatsub_wallet", mutation: `mutation MyMutation($id: uuid) {
                        update_whatsub_wallet(where: {id: {_eq: $id}}, _set: {purpose: "Processing withdrawal",type: "withdraw"}) {
                          affected_rows
                        }
                      }`, keys: ["id"]
                }],
            }, {
                showIf: (item) => (item.purpose === 'Processing refund'),
                name: "Issue refund",
                buttonType: "danger",
                allMutations: [{
                    mutation_item: "update_whatsub_wallet", mutation: `mutation MyMutation($id: uuid) {
                        update_whatsub_wallet(where: {id: {_eq: $id}}, _set: {purpose: "Refund Issued"}) {
                          affected_rows
                        }
                      }`, keys: ["id"]
                }],
            }], saveActions: [{
                keys: ["id", "purpose"], mutation: `mutation updateWallet($id:uuid,$purpose:String){
                            update_whatsub_wallet(where:{id:{_eq:$id}},_set:{purpose:$purpose}){
                            affected_rows
                            }
                        }`, mutation_item: "update_whatsub_wallet"
            }]
        }]
    }
};
let negative = {
    data: {
        components: [{
            type: "table",
            id: "negativesTable",
            title: "Negative",
            query_item: "whatsub_user_wallet",
            query: `query getNegativeBalance {
              whatsub_user_wallet(where: {}, order_by: {}, limit: 100, offset: 0) {
                user_id
                total_amount
                auth {
                  id
                  fullname
                  phone
                  email
                  whatsub_bank_account_detail {
                    account_name
                    bank_account_number
                    bank_name
                    ifsc
                    payout_type
                    upi_id
                  }
                  whatsub_user_wallet_locked_unlocked_internal {
                    internal_amount
                    locked_amount
                    unlocked_amount
                  }
                }
              }
            }`,
            heads: [{
                key: "user_id", name: "User Id", type: "uuid", nested_key: ["auth", "id"]
            }, {
                key: "fullname", name: "Name", type: "string", showInList: true, nested_key: ["auth", "fullname"]
            }, {
                key: "phone", name: "Phone", type: "string", showInList: true, nested_key: ["auth", "phone"], link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '" target="_blank">' + item.phone + '</a>'
                }, networkSearch: true
            }, {
                key: "email", name: "Email", type: "string", nested_key: ["auth", "email"]
            }, {
                key: "payout_type",
                name: "Payout Type",
                type: "string",
                loadOptionsFrom: ["bank", "upi"],
                nested_key: ["auth", "whatsub_bank_account_detail", "payout_type"]
            }, {
                key: "account_name",
                name: "Account Name",
                type: "string",
                nested_key: ["auth", "whatsub_bank_account_detail", "account_name"]
            }, {
                key: "bank_account_number",
                name: "Bank Account Number",
                type: "string",
                nested_key: ["auth", "whatsub_bank_account_detail", "bank_account_number"]
            }, {
                key: "bank_name",
                name: "bank Name",
                type: "string",
                nested_key: ["auth", "whatsub_bank_account_detail", "bank_name"]
            }, {
                key: "ifsc", name: "IFSC", type: "string", nested_key: ["auth", "whatsub_bank_account_detail", "ifsc"]
            }, {
                key: "upi_id",
                name: "UPI Id",
                type: "string",
                nested_key: ["auth", "whatsub_bank_account_detail", "upi_id"]
            }, {
                key: "locked_amount",
                name: "Locked Amount",
                type: "number",
                showInList: true,
                nested_key: ["auth", "whatsub_user_wallet_locked_unlocked_internal", "locked_amount"],
                networkSearch: true
            }, {
                key: "internal_amount",
                name: "Internal Amount",
                type: "number",
                showInList: true,
                nested_key: ["auth", "whatsub_user_wallet_locked_unlocked_internal", "internal_amount"],
                networkSearch: true
            }, {
                key: "unlocked_amount",
                name: "Unlocked Amount",
                type: "number",
                showInList: true,
                nested_key: ["auth", "whatsub_user_wallet_locked_unlocked_internal", "unlocked_amount"],
                networkSearch: true
            }, {
                key: "total_amount",
                name: "Total Amount",
                type: "number",
                showInList: true,
                networkSearch: true,
                networkSort: true
            }],
            filters: [],
            sorts: [{key: "total_amount", sort: "desc"}],
            dialogActions: [],
            saveActions: [],
            actions: []
        }]
    }
};
let coupons = {
    data: {
        components: [{
            type: "table", id: "couponsTable", title: "Coupons", top_buttons: [{
                name: "Add Coupon", buttonType: "dark", input: [{
                    key: "coupon_code", name: "Coupon Code", type: "string", canEdit: true, placeholder: "FUCKTEJA100"
                }, {
                    key: "discount_percentage",
                    name: "Discount Percentage",
                    type: "option",
                    canEdit: true,
                    defaultValue: 1,
                    loadOptionsFromObjects: [{
                        value: 1, name: "1% Off"
                    }, {
                        value: 2, name: "2% Off"
                    }, {
                        value: 3, name: "3% Off"
                    }, {
                        value: 4, name: "4% Off"
                    }, {
                        value: 5, name: "5% Off"
                    }, {
                        value: 10, name: "10% Off"
                    }, {
                        value: 20, name: "20% Off"
                    }, {
                        value: 50, name: "50% Off"
                    }]
                }, {
                    key: "max_amount",
                    name: "Max Amount",
                    type: "option",
                    canEdit: true,
                    defaultValue: 1,
                    loadOptionsFromObjects: [{
                        value: 100, name: "Rs 1 Max"
                    }, {
                        value: 200, name: "Rs 2 Max"
                    }, {
                        value: 300, name: "Rs 3 Max"
                    }, {
                        value: 400, name: "Rs 4 Max"
                    }, {
                        value: 500, name: "Rs 5 Max"
                    }, {
                        value: 1000, name: "Rs 10 Max"
                    }, {
                        value: 2000, name: "Rs 20 Max"
                    }, {
                        value: 5000, name: "Rs 50 Max"
                    }, {
                        value: 10000, name: "Rs 100 Max"
                    }]
                }, {
                    key: "limit",
                    name: "Limit",
                    type: "option",
                    canEdit: true,
                    defaultValue: 1,
                    loadOptionsFromObjects: [{
                        value: 1, name: "1 User Only"
                    }, {
                        value: 10, name: "10 Users Only"
                    }, {
                        value: 100, name: "100 Users Only"
                    }]
                }, {
                    key: "available",
                    name: "Available",
                    type: "option",
                    canEdit: true,
                    defaultValue: 1,
                    loadOptionsFromObjects: [{
                        value: 1, name: "1 User Only"
                    }, {
                        value: 10, name: "10 Users Only"
                    }, {
                        value: 100, name: "100 Users Only"
                    }]
                }, {
                    key: "duration", name: "Duration", type: "number", canEdit: true, defaultValue: 1
                }, {
                    key: "duration_type",
                    name: "Duration Type",
                    type: "option",
                    canEdit: true,
                    loadOptionsFrom: ["days", "months", "years"],
                    defaultValue: "days"
                }, {
                    key: "coupon_md",
                    name: "Coupon Condition",
                    type: "text",
                    canEdit: true,
                    defaultValue: "🎉 Get **1%** off up to **₹1** off on any subscription! From Jojjo!🎉",
                },], dialogActions: [{
                    name: "Add Coupon", buttonType: "dark", allMutations: [{
                        mutation_item: "insert_whatsub_coupons",
                        mutation: `mutation MyMutation($coupon_code: String = "", $available: numeric = "", $limit: numeric = "", $max_amount: numeric = "", $duration: Int = 10, $duration_type: String = "", $discount_percentage: numeric = "", $coupon_md: String = "") {
                                                                                  insert_whatsub_coupons(objects: {coupon_code: $coupon_code, available: $available, limit: $limit, max_amount: $max_amount, duration_type: $duration_type, duration: $duration, discount_percentage: $discount_percentage, coupon_md: $coupon_md}) {
                                                                                    affected_rows
                                                                                  }
                                                                                }`,
                        keys: ["coupon_code", "discount_percentage", "max_amount", "limit", "available", "duration", "duration_type", "coupon_md"]
                    }],
                }]
            }], query_item: "whatsub_coupons", query: `query MyQuery {
                          whatsub_coupons(order_by: {}, where: {}, limit: 100, offset: 0) {
                            available
                            coupon_code
                            coupon_md
                            created_at
                            discount_percentage
                            expiring_at
                            is_referral_coupon
                            id
                            limit
                            max_amount
                            updated_at
                            user_id
                            duration
                            duration_type
                            is_reverse_referral_coupon
                            auth {
                              fullname
                              email
                              phone
                            }
                          }
                        }`, heads: [{key: "id", name: "Id", type: "uuid"}, {
                key: "user_id", name: "User Id", type: "uuid"
            }, {
                key: "fullname",
                name: "Name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "phone", name: "Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => item.phone === null ? "" : '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '" target="_blank">' + item.phone + '</a>'
                }, nested_key: ["auth", "phone"], networkSearch: true, networkSort: true
            }, {
                key: "email", name: "Email", type: "string", nested_key: ["auth", "email"]
            }, {
                key: "coupon_code",
                name: "Coupon Code",
                type: "string",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "discount_percentage",
                name: "Discount Percentage",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "max_amount",
                name: "Max Amount",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "limit",
                name: "Limit",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "available",
                name: "Available",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "coupon_md", name: "Coupon MD", type: "text", canEdit: true
            }, {
                key: "expiring_at",
                name: "Expiring At",
                type: "time",
                timeFormat: "h:mm a, DD/MM/YY",
                showInList: true,
                canEdit: true,
                networkSort: true
            }, {
                key: "duration", name: "Duration", type: "number", canEdit: true
            }, {
                key: "duration_type",
                name: "Duration Type",
                type: "option",
                canEdit: true,
                loadOptionsFrom: ["days", "months", "years"]
            }, {
                key: "is_referral_coupon",
                name: "Referral Coupon",
                type: "boolean",
                showInList: true,
                loadOptionsFrom: [true, false],
                networkSearch: true,
                networkSort: true
            }, {
                key: "is_reverse_referral_coupon",
                name: "Reverse Referral Coupon",
                type: "boolean",
                showInList: true,
                loadOptionsFrom: [true, false],
                networkSearch: true,
                networkSort: true
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
            }], filters: [], sorts: [{key: "created_at", sort: "desc"}], dialogActions: [], saveActions: [{
                keys: ["id", "available", "coupon_code", "coupon_md", "discount_percentage", "expiring_at", "limit", "max_amount"],
                mutation: `mutation MyMutation($id: uuid = "", $available: numeric = "", $coupon_code: String = "", $coupon_md: String = "", $discount_percentage: numeric = "", $expiring_at: timestamp = "", $limit: numeric = "", $max_amount: numeric = "", $duration: Int = 0, $duration_type: String = "") {
                              update_whatsub_coupons(where: {id: {_eq: $id}}, _set: {available: $available, coupon_code: $coupon_code, coupon_md: $coupon_md, discount_percentage: $discount_percentage, expiring_at: $expiring_at, limit: $limit, max_amount: $max_amount, duration: $duration, duration_type: $duration_type}) {
                                affected_rows
                              }
                            }`,
                mutation_item: "update_whatsub_coupons"
            }]

        }]
    }
};
let plans = {
    data: {
        components: [{
            type: "table",
            id: "plansTable",
            title: "Plans",
            top_buttons: [{
                name: "Add Plan", buttonType: "dark", input: [{
                    key: "service_id",
                    name: "Service Id",
                    type: "uuid",
                    canEdit: true,
                    placeholder: "a79566f7-9cbc-4287-894d-e5f0270761ae"
                }, {
                    key: "plan_name", name: "Plan Name", type: "string", canEdit: true, placeholder: "Premium Plan"
                }, {
                    key: "price", name: "Price", type: "number", canEdit: true, placeholder: 0
                }, {
                    key: "discounted_price", name: "Discounted Price", type: "number", canEdit: true, placeholder: 0
                }, {
                    key: "currency_type",
                    name: "Currency Type",
                    type: "option",
                    canEdit: true,
                    loadOptionsFrom: ["inr", "usd", "eur"],
                    defaultValue: "inr"
                }, {
                    key: "duration", name: "Duration", type: "number", canEdit: true, placeholder: 1
                }, {
                    key: "duration_type",
                    name: "Duration Type",
                    type: "option",
                    canEdit: true,
                    loadOptionsFrom: ["days", "months", "years"],
                    defaultValue: "months"
                }, {
                    key: "subscription_type",
                    name: "Subscription Type",
                    type: "option",
                    canEdit: true,
                    loadOptionsFrom: ["RECURRING", "PREPAID"],
                    defaultValue: "RECURRING"
                }, {
                    key: "display_data",
                    name: "Display Data",
                    type: "string",
                    canEdit: true,
                    defaultValue: "₹ 0 / month",
                }, {
                    key: "status",
                    name: "Plan Status",
                    type: "option",
                    loadOptionsFrom: ["active", "inactive"],
                    canEdit: true,
                    defaultValue: "active"
                }], dialogActions: [{
                    name: "Add Plan", buttonType: "dark", allMutations: [{
                        mutation_item: "insert_whatsub_plans",
                        mutation: `mutation MyMutation($currency_type: String = "", $display_data: String = "", $duration: bigint = "", $duration_type: String = "", $price: float8 = "", $plan_name: String = "", $service_id: uuid = "", $status: String = "", $subscription_type: String = "", $discounted_price: float8 = "") {
                                                                          insert_whatsub_plans(objects: {currency_type: $currency_type, display_data: $display_data, duration: $duration, duration_type: $duration_type, price: $price, plan_name: $plan_name, service_id: $service_id, status: $status, subscription_type: $subscription_type, discounted_price: $discounted_price}) {
                                                                            affected_rows
                                                                          }
                                                                        }`,
                        keys: ["service_id", "plan_name", "price", "currency_type", "duration", "duration_type", "subscription_type", "display_data", "status", "discounted_price"]
                    }],
                }]
            }, {
                name: "Add Product", buttonType: "dark", input: [{
                    key: "service_id",
                    name: "Service Id",
                    type: "uuid",
                    canEdit: true,
                    placeholder: "a79566f7-9cbc-4287-894d-e5f0270761ae"
                }, {
                    key: "plan_name", name: "Product Name", type: "string", canEdit: true, placeholder: "Gift Card"
                }, {
                    key: "price", name: "Price", type: "number", canEdit: true, placeholder: 0
                }, {
                    key: "discounted_price", name: "Discounted Price", type: "number", canEdit: true, placeholder: 0
                }, {
                    key: "currency_type",
                    name: "Currency Type",
                    type: "option",
                    canEdit: true,
                    loadOptionsFrom: ["inr", "usd", "eur"],
                    defaultValue: "inr"
                }, {
                    key: "display_data",
                    name: "Display Data",
                    type: "string",
                    canEdit: true,
                    defaultValue: "₹ 0 / month",
                }, {
                    key: "status",
                    name: "Status",
                    type: "option",
                    loadOptionsFrom: ["active", "inactive"],
                    canEdit: true,
                    defaultValue: "active"
                }], dialogActions: [{
                    name: "Add Product", buttonType: "dark", allMutations: [{
                        mutation_item: "insert_whatsub_plans",
                        mutation: `mutation MyMutation($currency_type: String = "", $price: float8 = "", $discounted_price: float8 = "", $plan_name: String = "", $service_id: uuid = "", $status: String = "", $display_data: String = "") {
                                          insert_whatsub_plans(objects: {currency_type: $currency_type, display_data: $display_data, price: $price, discounted_price: $discounted_price, plan_name: $plan_name, service_id: $service_id, status: $status, is_plan: false}) {
                                            affected_rows
                                          }
                                        }`,
                        keys: ["service_id", "plan_name", "price", "currency_type", "display_data", "status", "discounted_price"]
                    }],
                }]
            }],
            query_item: "whatsub_plans",
            query: `query MyQuery {
                  whatsub_plans(where: {}, order_by: {}, limit: 100, offset: 0) {
                    id
                    whatsub_service {
                      id
                      service_name
                      status
                    }
                    plan_name
                    price
                    accounts
                    status
                    mrp_price
                    currency_type
                    plan_conditions
                    suggest_sharing
                    user_conditions
                    admin_conditions
                    display_data
                    duration
                    duration_type
                    suggest_sharing_limit
                    discounted_price
                    created_at
                    updated_at
                    plan_details
                    auto_generate_coupons
                    is_plan
                    subscription_type
                    supply_vendor
                    supply_vendor_sku
                    supply_vendor_instructions
                  }
                }
                `,
            heads: [{key: "id", name: "Id", type: "uuid"}, {
                key: "service_id", name: "Service Id", type: "uuid", nested_key: ["whatsub_service", "id"]
            }, {
                key: "is_plan",
                name: "Is Plan",
                type: "boolean",
                canEdit: true,
                showInList: true,
                loadOptionsFrom: [true, false],
                networkSearch: true,
                networkSort: true
            }, {
                key: "service_name",
                name: "Service Name",
                type: "string",
                showInList: true,
                loadOptionsFrom: "whatsub_class",
                nested_key: ["whatsub_service", "service_name"],
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "plan_name",
                name: "Name",
                type: "string",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "price",
                name: "Price",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "auto_generate_coupons",
                name: "Auto Generate Coupons",
                type: "boolean",
                canEdit: true,
                showInList: true,
                loadOptionsFrom: [true, false],
                networkSearch: true,
                networkSort: true
            }, {
                key: "mrp_price",
                name: "MRP Price",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "currency_type",
                name: "Currency Type",
                type: "option",
                showInList: true,
                canEdit: true,
                loadOptionsFrom: ["inr", "usd", "eur"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "discounted_price",
                name: "Discounted Price",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "supply_vendor",
                name: "Supply Vendor",
                type: "option",
                loadOptionsFrom: ["manual", "sayf", "qwikcilver", "sanjay", "tarun", "yogesh", "subspace"],
                defaultValue: "manual",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "supply_vendor_sku",
                name: "Supply Vendor SKU",
                type: "string",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "supply_vendor_instructions", name: "Supply Vendor Instructions", type: "text", canEdit: true
            }, {
                key: "display_data", name: "Display Data", type: "string", canEdit: true
            }, {
                key: "duration",
                name: "Duration",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "duration_type",
                name: "Duration Type",
                type: "option",
                showInList: true,
                canEdit: true,
                loadOptionsFrom: ["days", "months", "years"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "accounts",
                name: "Accounts",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "suggest_sharing",
                name: "Suggest Sharing",
                type: "boolean",
                showInList: true,
                loadOptionsFrom: [true, false],
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "status",
                name: "Plan Status",
                type: "option",
                showInList: true,
                loadOptionsFrom: ["active", "inactive"],
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "service_status",
                name: "Service Status",
                type: "option",
                loadOptionsFrom: ["active", "inactive"],
                canEdit: true,
                showInList: true,
                nested_key: ["whatsub_service", "status"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "subscription_type",
                name: "Subscription Type",
                type: "option",
                loadOptionsFrom: ["PREPAID", "RECURRING"],
                canEdit: true,
                showInList: true,
                networkSearch: true,
                networkSort: true
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
            }, {
                key: "suggest_sharing_limit", name: "Suggest Sharing Limit", type: "number", canEdit: true
            }, {
                key: "plan_details", name: "Plan Details", type: "text", canEdit: true
            }, {
                key: "plan_conditions", name: "Terms and Conditions", type: "text", canEdit: true
            }, {
                key: "admin_conditions", name: "Admin Conditions", type: "text", canEdit: true
            }, {
                key: "user_conditions", name: "User Conditions", type: "text", canEdit: true
            }],
            filters: [{key: "service_id", match_type: "_eq", data_type: "uuid"}],
            sorts: [{key: "created_at", sort: "desc"}],
            dialogActions: [{
                name: "Delete Plan", buttonType: "danger", allMutations: [{
                    mutation_item: "delete_whatsub_plans", mutation: `mutation MyMutation($id: uuid = "") {
                                                                                  delete_whatsub_plans(where: {id: {_eq: $id}}) {
                                                                                    affected_rows
                                                                                  }
                                                                                }`, keys: ["id"]
                }],
            }],
            saveActions: [{
                keys: ["id", "accounts", "plan_name", "price", "mrp_price", "status", "plan_conditions", "suggest_sharing", "admin_conditions", "user_conditions", "display_data", "duration", "duration_type", "suggest_sharing_limit", "discounted_price", "currency_type", "plan_details", "auto_generate_coupons", "is_plan", "subscription_type", "supply_vendor", "supply_vendor_sku", "supply_vendor_instructions"],
                mutation: `mutation MyMutation($accounts: bigint = "", $plan_name: String = "", $status: String = "", $id: uuid = "", $price: float8 = "", $mrp_price: float8 = "", $plan_conditions: String = "", $suggest_sharing: Boolean = false, $user_conditions: String = "", $admin_conditions: String = "", $display_data: String = "", $duration: bigint = "", $duration_type: String = "", $suggest_sharing_limit: Int = 10, $discounted_price: float8 = "", $currency_type: String = "", $plan_details: String = "", $auto_generate_coupons: Boolean = "", $is_plan: Boolean = "", $subscription_type: String = "", $supply_vendor: String = "", $supply_vendor_sku: String = "", $supply_vendor_instructions: String = "") {
                              update_whatsub_plans(_set: {accounts: $accounts, plan_name: $plan_name, mrp_price: $mrp_price, status: $status, price: $price, plan_conditions: $plan_conditions, suggest_sharing: $suggest_sharing, user_conditions: $user_conditions, admin_conditions: $admin_conditions, display_data: $display_data, duration: $duration, duration_type: $duration_type, suggest_sharing_limit: $suggest_sharing_limit, discounted_price: $discounted_price, currency_type: $currency_type, plan_details: $plan_details, auto_generate_coupons: $auto_generate_coupons, is_plan: $is_plan, subscription_type: $subscription_type, supply_vendor: $supply_vendor, supply_vendor_sku: $supply_vendor_sku, supply_vendor_instructions: $supply_vendor_instructions}, where: {id: {_eq: $id}}) {
                                affected_rows
                              }
                            }`,
                mutation_item: "update_whatsub_plans"
            }, {
                keys: ["service_id", "service_name", "service_status"],
                mutation: `mutation MyMutation($service_name: String = "", $service_status: String = "", $service_id: uuid = "") {
                                                                                          update_whatsub_services(_set: {service_name: $service_name, status: $service_status}, where: {id: {_eq: $service_id}}) {
                                                                                            affected_rows
                                                                                          }
                                                                                        }`,
                mutation_item: "update_whatsub_services"
            }]
        }]
    }
};
let services = {
    data: {
        components: [{
            type: "table",
            id: "servicesTable",
            title: "Services",
            top_buttons: [{
                name: "Refresh Search Data",
                body: "<div class='alert alert-danger' role='alert'>Please don't click the refresh button repeatedly! Click once and wait for it to finish its job!</div>",
                buttonType: "dark",
                input: [],
                dialogActions: [{
                    name: "Refresh", buttonType: "dark", allMutations: [{
                        mutation_item: "w_updateServiceData", mutation: `mutation MyMutation2 {
                                                                                  w_updateServiceData {
                                                                                    affected_rows
                                                                                  }
                                                                                }`, keys: []
                    }],
                }]
            }, {
                name: "Add Service", buttonType: "dark", input: [{
                    key: "class_id",
                    name: "Class Id",
                    type: "option",
                    canEdit: true,
                    defaultValue: "93adea42-bee2-44d9-a586-1ecece14df77",
                    loadOptionsFromObjects: [{
                        value: "93adea42-bee2-44d9-a586-1ecece14df77", name: "misc"
                    }],
                    loadOptionsFromObjectsQuery: `query MyQuery {
                                                      whatsub_class {
                                                        id
                                                        name
                                                      }
                                                    }`,
                    loadOptionsFromObjectsQueryArray: ["whatsub_class"],
                    loadOptionsFromObjectsQueryValue: "id",
                    loadOptionsFromObjectsQueryName: "name",
                }, {
                    key: "service_name", name: "Service Name", type: "string", canEdit: true, placeholder: "Grow90"
                }, {
                    key: "image_url",
                    name: "Image URL",
                    type: "string",
                    canEdit: true,
                    defaultValue: "https://i.postimg.cc/2yHjXNxn/img-215255.png",
                    uploadImageData: {
                        destinationFolder: ["whatsub_services", "image_url"], cropperOptions: {
                            options: {
                                aspectRatio: 1
                            }
                        }
                    }
                }, {
                    key: "status",
                    name: "Plan Status",
                    type: "option",
                    loadOptionsFrom: ["active", "inactive"],
                    canEdit: true,
                    defaultValue: "active"
                }], dialogActions: [{
                    name: "Add Service", buttonType: "dark", allMutations: [{
                        mutation_item: "insert_whatsub_services", mutation: `mutation MyMutation($class_id: uuid = "", $image_url: String = "", $service_name: String = "", $status: String = "") {
                                      insert_whatsub_services(objects: {class_id: $class_id, service_name: $service_name, image_url: $image_url, status: $status}) {
                                        affected_rows
                                      }
                                    }`, keys: ["class_id", "service_name", "image_url", "status"]
                    }],
                }]
            }, {
                name: "Add Service From Playstore", buttonType: "dark", input: [{
                    key: "class_id",
                    name: "Class Id",
                    type: "option",
                    canEdit: true,
                    defaultValue: "93adea42-bee2-44d9-a586-1ecece14df77",
                    loadOptionsFromObjects: [{
                        value: "93adea42-bee2-44d9-a586-1ecece14df77", name: "misc"
                    }],
                    loadOptionsFromObjectsQuery: `query MyQuery {
                                                      whatsub_class {
                                                        id
                                                        name
                                                      }
                                                    }`,
                    loadOptionsFromObjectsQueryArray: ["whatsub_class"],
                    loadOptionsFromObjectsQueryValue: "id",
                    loadOptionsFromObjectsQueryName: "name",
                }, {
                    key: "play_store_url",
                    name: "Play Store URL",
                    type: "string",
                    canEdit: true,
                    placeholder: "https://play.google.com/store/apps/details?id=org.grow90.whatsub"
                }, {
                    key: "service_name", name: "Service Name", type: "string", canEdit: true, placeholder: "Subspace"
                }, {
                    key: "service_id",
                    name: "Service ID",
                    type: "string",
                    canEdit: true,
                    placeholder: "77b848e6-33c2-4a62-bbfb-defde1f72d00"
                }], dialogActions: [{
                    name: "Add Service", buttonType: "dark", allMutations: [{
                        mutation_item: "w_addServiceFromPlaystore",
                        mutation: `mutation MyMutation($service_name: String = "fleek", $service_id: uuid = "77b848e6-33c2-4a62-bbfb-defde1f72d00", $play_store_url: String = "https://play.google.com/store/apps/details?id=com.fleek.app", $class_id: String = "93adea42-bee2-44d9-a586-1ecece14df77") {
                                                                                  w_addServiceFromPlaystore(request: {class_id: $class_id, play_store_url: $play_store_url, service_name: $service_name, service_id: $service_id}) {
                                                                                    affected_rows
                                                                                  }
                                                                                }`,
                        keys: ["class_id", "service_name", "service_id", "play_store_url"]
                    }],
                }]
            }],
            query_item: "whatsub_services",
            query: `query MyQuery {
                  whatsub_services(where: {}, limit: 100, offset: 0, order_by: {}) {
                    id
                    service_name
                    url
                    play_store_url
                    status
                    image_url
                    poster_url
                    about
                    package_name
                    playstore_rating
                    playstore_number_of_ratings
                    backdrop_url
                    class_id
                    created_at
                    updated_at
                    flexipay
                    flexipay_discount
                    flexipay_min
                    flexipay_max
                    flexipay_vendor
                    flexipay_vendor_sku
                    flexipay_vendor_instructions
                    flexipay_unit
                    flexipay_duration
                    flexipay_duration_type
                    whatsub_class {
                      id
                      name
                    }
                    whatsub_plans_aggregate {
                      aggregate {
                        count(columns: id)
                      }
                    }
                  }
                }`,
            heads: [{key: "id", name: "Id", type: "uuid"}, {
                key: "service_name",
                name: "Name",
                type: "string",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "status",
                name: "Status",
                type: "option",
                showInList: true,
                loadOptionsFrom: ["active", "inactive"],
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "flexipay",
                name: "Flexipay",
                type: "boolean",
                canEdit: true,
                showInList: true,
                loadOptionsFrom: [true, false],
                networkSearch: true,
                networkSort: true
            }, {
                key: "flexipay_discount",
                name: "Flexipay Discount",
                type: "number",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "flexipay_min",
                name: "Flexipay Min Amount",
                type: "number",
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "flexipay_max",
                name: "Flexipay Max Amount",
                type: "number",
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "flexipay_vendor",
                name: "Flexipay Vendor",
                type: "option",
                loadOptionsFrom: ["manual", "sayf", "qwikcilver", "sanjay", "tarun", "yogesh", "subspace"],
                defaultValue: "manual",
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "flexipay_vendor_sku", name: "Flexipay Vendor SKU", type: "string", canEdit: true
            }, {
                key: "flexipay_vendor_instructions", name: "Flexipay Vendor Instructions", type: "text", canEdit: true
            }, {
                key: "flexipay_unit",
                name: "Flexipay Unit",
                type: "string",
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "flexipay_duration", name: "Flexipay Duration", type: "number", canEdit: true
            }, {
                key: "flexipay_duration_type",
                name: "Flexipay Duration Type",
                type: "option",
                canEdit: true,
                loadOptionsFrom: ["days", "months", "years"]
            }, {
                key: "class_id",
                name: "Class",
                type: "option",
                loadOptionsFromObjects: [{
                    value: "93adea42-bee2-44d9-a586-1ecece14df77", name: "misc"
                }],
                canEdit: true,
                loadOptionsFromObjectsQuery: `query MyQuery {
                                                      whatsub_class {
                                                        id
                                                        name
                                                      }
                                                    }`,
                loadOptionsFromObjectsQueryArray: ["whatsub_class"],
                loadOptionsFromObjectsQueryValue: "id",
                loadOptionsFromObjectsQueryName: "name"
            }, {
                key: "class",
                name: "Class",
                type: "option",
                showInList: true,
                hideInEdit: true,
                loadOptionsFrom: "whatsub_class",
                nested_key: ["whatsub_class", "name"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "plans_count",
                name: "Number of Plans",
                type: "number",
                showInList: true,
                nested_key: ["whatsub_plans_aggregate", "aggregate", "count"],
                link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="/subspace/plans?service_id=' + item.id + '" target="_blank">' + item.plans_count + '</a>'
                }
            }, {
                key: "url",
                name: "Website",
                type: "string",
                showInList: true,
                link: {type: "redirect"},
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "play_store_url", name: "Play Store Link", type: "string", link: {type: "redirect"}, canEdit: true
            }, {key: "about", name: "About", type: "text", canEdit: true}, {
                key: "package_name", name: "App Package Name", type: "string", canEdit: true
            }, {
                key: "playstore_rating", name: "Playstore Rating", type: "string", canEdit: true
            }, {
                key: "playstore_number_of_ratings", name: "Playstore Number of Ratings", type: "string", canEdit: true
            }, {
                key: "image_url",
                name: "Image Url",
                type: "string",
                link: {type: "redirect"},
                canEdit: true,
                uploadImageData: {
                    destinationFolder: ["whatsub_services", "image_url"], cropperOptions: {
                        options: {
                            aspectRatio: 1
                        }
                    }
                }
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
            }, {
                key: "poster_url",
                name: "Poster Url",
                type: "string",
                link: {type: "redirect"},
                canEdit: true,
                uploadImageData: {
                    destinationFolder: ["whatsub_services", "poster_url"], cropperOptions: {
                        options: {
                            aspectRatio: 2 / 3
                        }
                    }
                }
            }, {
                key: "backdrop_url",
                name: "Backdrop Url",
                type: "string",
                link: {type: "redirect"},
                canEdit: true,
                uploadImageData: {
                    destinationFolder: ["whatsub_services", "backdrop_url"], cropperOptions: {
                        options: {
                            aspectRatio: 2
                        }
                    }
                }
            }],
            filters: [{key: "id", match_type: "_eq", data_type: "string"}],
            sorts: [{key: "created_at", sort: "desc"}],
            dialogActions: [{
                showIf: (item) => (item.plans_count <= 0),
                name: "Delete Service",
                buttonType: "danger",
                allMutations: [{
                    mutation_item: "delete_whatsub_services", mutation: `mutation MyMutation($id: uuid = "") {
                                                                              delete_whatsub_services(where: {id: {_eq: $id}}) {
                                                                                affected_rows
                                                                              }
                                                                            }`, keys: ["id"]
                }],
            }],
            saveActions: [{
                keys: ["id", "service_name", "status", "url", "play_store_url", "image_url", "poster_url", "backdrop_url", "about", "package_name", "playstore_rating", "playstore_number_of_ratings", "class_id", "flexipay", "flexipay_discount", "flexipay_min", "flexipay_max", "flexipay_vendor", "flexipay_unit", "flexipay_duration", "flexipay_duration_type", "flexipay_vendor_sku", "flexipay_vendor_instructions"],
                mutation: `mutation MyMutation($service_name: String = "", $status: String = "", $url: String = "", $play_store_url: String = "", $id: uuid = "", $poster_url: String = "", $backdrop_url: String = "", $image_url: String = "", $about: String = "", $package_name: String = "", $playstore_rating: float8 = "", $playstore_number_of_ratings: Int = 10, $class_id: uuid = "", $flexipay: Boolean = false, $flexipay_discount: numeric = 0, $flexipay_max: numeric = "", $flexipay_min: numeric = "", $flexipay_vendor: String = "", $flexipay_vendor_sku: String = "", $flexipay_vendor_instructions: String = "", $flexipay_unit: String = "", $flexipay_duration: bigint = "", $flexipay_duration_type: String = "") {
  update_whatsub_services(_set: {service_name: $service_name, status: $status, url: $url, play_store_url: $play_store_url, poster_url: $poster_url, backdrop_url: $backdrop_url, image_url: $image_url, about: $about, package_name: $package_name, playstore_rating: $playstore_rating, playstore_number_of_ratings: $playstore_number_of_ratings, class_id: $class_id, flexipay: $flexipay, flexipay_discount: $flexipay_discount, flexipay_max: $flexipay_max, flexipay_min: $flexipay_min, flexipay_vendor: $flexipay_vendor, flexipay_vendor_sku: $flexipay_vendor_sku, flexipay_vendor_instructions: $flexipay_vendor_instructions, flexipay_unit: $flexipay_unit, flexipay_duration: $flexipay_duration, flexipay_duration_type: $flexipay_duration_type}, where: {id: {_eq: $id}}) {
    affected_rows
  }
}`,
                mutation_item: "update_whatsub_services"
            }]
        }]
    }
};
let productCoupons = {
    data: {
        components: [{
            type: "table", id: "productCouponsTable", title: "Product Coupons", top_buttons: [{
                name: "Add Coupon", buttonType: "dark", input: [{
                    key: "coupon", name: "Coupon", type: "string", canEdit: true, defaultValue: "Generating"
                }, {
                    key: "pin", name: "Pin", type: "string", canEdit: true, defaultValue: null
                }, {
                    key: "plan_id",
                    name: "Plan ID",
                    type: "string",
                    canEdit: true,
                    placeholder: "5e45c380-6f65-459d-a4ff-79149a3beda7"
                }, {
                    key: "expiring_at",
                    name: "Expiring At",
                    type: "time",
                    canEdit: true,
                    defaultValue: moment().add(6, 'M').format('YYYY-MM-DD')
                }, {
                    key: "status",
                    name: "Status",
                    type: "option",
                    canEdit: true,
                    loadOptionsFrom: ["active", "inactive"],
                    defaultValue: "active"
                }], dialogActions: [{
                    name: "Add Coupon", buttonType: "dark", allMutations: [{
                        mutation_item: "insert_whatsub_coupon_allocation", mutation: `mutation MyMutation($coupon: String = "", $expiring_at: date = "", $plan_id: uuid = "", $status: String = "") {
                                              insert_whatsub_coupon_allocation(objects: {coupon: $coupon, expiring_at: $expiring_at, plan_id: $plan_id, status: $status}) {
                                                affected_rows
                                              }
                                            }`, keys: ["coupon", "plan_id", "expiring_at", "status"]
                    }],
                }]
            }], query_item: "whatsub_coupon_allocation", query: `query MyQuery {
          whatsub_coupon_allocation(order_by: {}, where: {}, limit: 100, offset: 0) {
            action
            action_name
            avail_conditions
            coupon
            pin
            created_at
            expiring_at
            id
            plan_id
            service_id
            status
            updated_at
            user_id
            allocated_at
            delivery_status
            assigned_to
            auth {
              email
              fullname
              phone
            }
            amount
            whatsub_service {
              service_name
              flexipay_unit
            }
            whatsub_plan {
              plan_name
              whatsub_service {
                service_name
              }
            }
          }
        }`, heads: [{key: "id", name: "Id", type: "string"}, {
                key: "user_id", name: "User Id", type: "string", canEdit: true
            }, {
                key: "plan_id", name: "Plan Id", type: "string", canEdit: true
            }, {
                key: "service_id", name: "Service Id", type: "string", canEdit: true
            }, {
                key: "status",
                name: "Status",
                type: "option",
                showInList: true,
                loadOptionsFrom: ["active", "inactive"],
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "delivery_status",
                name: "Delivery Status",
                type: "option",
                showInList: true,
                loadOptionsFrom: ["Pending", "Ongoing", "Done"],
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "assigned_to",
                name: "Assigned to",
                type: "string",
                showInList: true,
                networkSearch: true
            }, {
                key: "coupon",
                name: "Coupon",
                type: "string",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "pin",
                name: "Pin",
                type: "string",
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "expiring_at",
                name: "Expiring At",
                type: "time",
                timeFormat: "h:mm a, DD/MM/YY",
                showInList: true,
                canEdit: true,
                networkSort: true
            }, {
                key: "fullname",
                name: "Name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "phone", name: "Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => item.phone === null ? "" : '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '" target="_blank">' + item.phone + '</a>'
                }, nested_key: ["auth", "phone"], networkSearch: true, networkSort: true
            }, {
                key: "email", name: "Email", type: "string", nested_key: ["auth", "email"]
            }, {
                key: "service_name",
                name: "Service Name",
                type: "string",
                nested_key: ["whatsub_plan", "whatsub_service", "service_name"],
                showInList: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "plan_name",
                name: "Plan Name",
                type: "string",
                nested_key: ["whatsub_plan", "plan_name"],
                showInList: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "flexible_service_name",
                name: "Flexible SN",
                type: "string",
                nested_key: ["whatsub_service", "service_name"],
                showInList: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "flexible_service_unit",
                name: "Flexible SU",
                type: "string",
                nested_key: ["whatsub_service", "flexipay_unit"],
                showInList: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "amount", name: "Amount", type: "number", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "action_name", name: "Action Name", type: "string", canEdit: true
            }, {
                key: "do_action", name: "Action", type: "object", nested_key: ["action"]
            }, {
                key: "avail_conditions", name: "Avail Conditions", type: "text", canEdit: true
            }, {
                key: "allocated_at",
                name: "Allocated At",
                type: "time",
                timeFormat: "h:mm a, DD/MM/YY",
                showInList: true,
                networkSort: true
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
            }], filters: [], sorts: [{key: "updated_at", sort: "desc"}], dialogActions: [{
                showIf: (item) => (item.user_id === null), name: "Delete Coupon", buttonType: "danger", allMutations: [{
                    mutation_item: "delete_whatsub_coupon_allocation", mutation: `mutation MyMutation($id: uuid = "") {
                                                                      delete_whatsub_coupon_allocation(where: {id: {_eq: $id}}) {
                                                                        affected_rows
                                                                      }
                                                                    }`, keys: ["id"]
                }],
            }], saveActions: [{
                keys: ["id", "action_name", "avail_conditions", "coupon", "pin", "expiring_at", "plan_id", "service_id", "status", "user_id", "do_action", "delivery_status"],
                mutation: `mutation MyMutation($id: uuid = "", $action_name: String = "", $avail_conditions: String = "", $coupon: String = "", $pin: String = "", $expiring_at: date = "", $plan_id: uuid = "", $service_id: uuid = "", $status: String = "", $user_id: uuid = "", $do_action: jsonb = "", $delivery_status: String="") {
                    update_whatsub_coupon_allocation(where: {id: {_eq: $id}}, _set: {action_name: $action_name, avail_conditions: $avail_conditions, coupon: $coupon, pin: $pin, expiring_at: $expiring_at, plan_id: $plan_id, service_id: $service_id, status: $status, user_id: $user_id, action: $do_action, delivery_status: $delivery_status}) {
                      affected_rows
                    }
                  }`,
                mutation_item: "update_whatsub_coupon_allocation"
            }]

        }]
    }
};
let searchLogs = {
    data: {
        components: [{
            type: "table", id: "whatsubSearchLogs", title: "Search Logs", query_item: "whatsub_search_logs", query: `query MyQuery {
              whatsub_search_logs(order_by: {}, limit: 100, offset: 0, where: {}) {
                id
                query
                created_at
                updated_at
                auth {
                  fullname
                  phone
                }
              }
            }`, heads: [{
                key: "id", name: "Id", type: "uuid", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "fullname",
                name: "Name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "phone", name: "Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '" target="_blank">' + item.phone + '</a>'
                }, nested_key: ["auth", "phone"], networkSearch: true, networkSort: true
            }, {
                key: "query", name: "Query", type: "string", showInList: true, networkSearch: true, networkSort: true
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
            }], filters: [], sorts: [{key: "created_at", sort: "desc"}], dialogActions: [], saveActions: []
        }]
    }
};
let trendingSearchLogs = {
    data: {
        components: [{
            type: "table",
            id: "whatsubTrendingSearchLogs",
            title: "Trending Search Logs",
            query_item: "whatsub_search_logs_trending",
            query: `query MyQuery {
                  whatsub_search_logs_trending(order_by: {}, limit: 100, offset: 0, where: {}) {
                    query
                    count
                  }
                }`,
            heads: [{
                key: "query", name: "Query", type: "string", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "count", name: "Count", type: "number", showInList: true, networkSearch: true, networkSort: true
            }],
            filters: [],
            sorts: [{key: "count", sort: "desc"}],
            dialogActions: [],
            saveActions: []
        }]
    }
};
let ratings = {
    data: {
        components: [{
            type: "table", id: "ratingsTable", title: "Admin Ratings", query_item: "whatsub_admin_ratings", query: `query MyQuery {
                              whatsub_admin_ratings(order_by: {}, where: {}, limit: 100, offset: 0) {
                                id
                                review
                                rating
                                updated_at
                                created_at
                                from_user_id
                                user_id
                                operation_status
                                auth {
                                  fullname
                                  email
                                  phone
                                }
                                authByUserId {
                                  fullname
                                  email
                                  phone
                                }
                              }
                            }`, heads: [{
                key: "operation_status",
                name: "Operation Status",
                type: "option",
                loadOptionsFrom: ["Pending", "Resolved", "Awaiting Member's Response", "Awaiting Admins Response"],
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "id", name: "Id", type: "uuid"
            }, {
                key: "from_user_id", name: "Member User Id", type: "uuid"
            }, {
                key: "user_id", name: "Admin User Id", type: "uuid"
            }, {
                key: "fullname",
                name: "Member Name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "phone", name: "Member Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '&text=Hello, ' + item.fullname + ', I am Manoj from Subspace App. You have given ' + item.rating + ' star to your admin ' + item.admin_fullname + '. Please assist us in comprehending the situation and resolving the problem." target="_blank">' + item.phone + '</a>'
                }, nested_key: ["auth", "phone"], networkSearch: true, networkSort: true
            }, {
                key: "email", name: "Member Email", type: "string", nested_key: ["auth", "email"]
            }, {
                key: "admin_fullname",
                name: "Admin Name",
                type: "string",
                showInList: true,
                nested_key: ["authByUserId", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "admin_phone", name: "Admin Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.admin_phone + '&text=Hello, ' + item.admin_fullname + ', I am Manoj from Subspace App. You have got a ' + item.rating + ' star rating from your member, ' + item.fullname + '. Please resolve this issue with the member as soon as possible." target="_blank">' + item.admin_phone + '</a>'
                }, nested_key: ["authByUserId", "phone"], networkSearch: true, networkSort: true
            }, {
                key: "admin_email", name: "Admin Email", type: "string", nested_key: ["authByUserId", "email"]
            }, {
                key: "review", name: "review", type: "string", showInList: true, networkSearch: true, networkSort: true
            }, {
                key: "rating", name: "rating", type: "number", showInList: true, networkSearch: true, networkSort: true
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
            }], filters: [], sorts: [{key: "created_at", sort: "desc"}], dialogActions: [], saveActions: [{
                keys: ["id", "operation_status"], mutation: `mutation MyMutation($operation_status: String = "", $id: uuid = "") {
                                      update_whatsub_admin_ratings(_set: {operation_status: $operation_status}, where: {id: {_eq: $id}}) {
                                        affected_rows
                                      }
                                    }`, mutation_item: "update_whatsub_admin_ratings"
            }]
        }]
    }
};
let spams = {
    data: {
        components: [{
            type: "table", id: "spamsTable", title: "Spams Reported", query_item: "whatsub_report_user", query: `query MyQuery {
                whatsub_report_user(order_by: {}, limit: 100, offset: 0) {
                  id
                  user_id
                  auth{
                    fullname
                    phone
                    email
                  }
                  from_user_id
                  auth2{
                    fullname
                    phone
                    email
                  }
                  created_at
                  updated_at
                  whatsub_message {
                    message
                    room_id
                  }
                  operation_status
                }
              }`, heads: [{
                key: "operation_status",
                name: "Operation Status",
                type: "option",
                loadOptionsFrom: ["Pending", "Resolved", "Ongoing"],
                showInList: true,
                canEdit: true,
                networkSearch: true,
                networkSort: true
            }, {
                key: "id", name: "Id", type: "uuid"
            }, {
                key: "user_id", name: "User Id", type: "uuid"
            }, {
                key: "from_user_id", name: "Reported by", type: "uuid"
            }, {
                key: "admin_fullname",
                name: "Admin name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "admin_phone", name: "Admin Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.admin_phone + '&text=Hello, ' + item.admin_fullname + ', I am Manoj from Subspace App." target="_blank">' + item.admin_phone + '</a>'
                }, nested_key: ["auth", "phone"], networkSearch: true, networkSort: true
            }, {
                key: "admin_email", name: "Admin Email", type: "string", nested_key: ["auth", "email"]
            }, {
                key: "fullname",
                name: "Reporter name",
                type: "string",
                showInList: true,
                nested_key: ["auth2", "fullname"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "phone",
                name: "Reporter Phone",
                type: "string",
                showInList: true,
                nested_key: ["auth2", "phone"],
                networkSearch: true,
                networkSort: true
            }, {
                key: "email", name: "Reporter Email", type: "string", nested_key: ["auth2", "email"]
            }, {
                key: "message",
                name: "message",
                type: "string",
                nested_key: ["whatsub_message", "message"],
                showInList: true,
                networkSearch: true,
                networkSort: true
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
            }], filters: [], sorts: [{key: "updated_at", sort: "desc"}], dialogActions: [], saveActions: [{
                keys: ["id", "operation_status"], mutation: `mutation MyMutation($operation_status: String = "", $id: uuid = "") {
                                      update_whatsub_report_user(_set: {operation_status: $operation_status}, where: {id: {_eq: $id}}) {
                                        affected_rows
                                      }
                                    }`, mutation_item: "update_whatsub_report_user"
            }]
        }]
    }
};
let leaveRequests = {
    data: {
        components: [{
            type: "table",
            id: "leaveRequestsTable",
            title: "Leave Requests",
            query_item: "whatsub_room_user_mapping",
            query: `query MyQuery {
                          whatsub_room_user_mapping(where: {leave_request: {_eq: true}}, order_by: {}, limit: 100, offset: 0) {
                            id
                            auth{
                              fullname
                              phone
                              email
                            }
                            room_id
                            user_id
                            leave_request_reason
                            created_at
                            updated_at
                            statusDetected
                            whatsub_room {
                              user_id
                              auth{
                                fullname
                                phone
                                email
                              }
                              name
                            }
                          }
                        }`,
            heads: [{
                key: "statusDetected", name: "Machine Detection", type: "string", showInList: true, networkSort: true
            }, {
                key: "id", name: "Id", type: "uuid"
            }, {
                key: "user_id", name: "User Id", type: "uuid"
            }, {
                key: "room_id", name: "Room Id", type: "uuid"
            }, {
                key: "fullname",
                name: "Name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSort: true
            }, {
                key: "phone", name: "Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '&text=Helllo, ' + item.fullname + ', I am Manoj from Subspace App. You have made a request to leave the ' + item.room_name + ' group. Why do you want to leave the group?" target="_blank">' + item.phone + '</a>'
                }, nested_key: ["auth", "phone"], networkSort: true
            }, {
                key: "email", name: "Email", type: "string", nested_key: ["auth", "email"]
            }, {
                key: "admin_fullname",
                name: "Admin Name",
                type: "string",
                showInList: true,
                nested_key: ["whatsub_room", "auth", "fullname"],
                networkSort: true
            }, {
                key: "admin_phone", name: "Admin Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.admin_phone + '&text=Hello, ' + item.admin_fullname + ', I am Manoj from Subspace App. ' + item.fullname + ' has made a request to leave your ' + item.room_name + ' group with the reason -' + item.leave_request_reason + '-.  Can you please call and resolve the issue with your member? " target="_blank">' + item.admin_phone + '</a>'
                }, nested_key: ["whatsub_room", "auth", "phone"], networkSort: true
            }, {
                key: "admin_email", name: "Admin Email", type: "string", nested_key: ["whatsub_room", "auth", "email"]
            }, {
                key: "leave_request_reason",
                name: "Leave Request Reason",
                type: "string",
                showInList: true,
                networkSort: true
            }, {
                key: "room_name",
                name: "Room Name",
                type: "string",
                nested_key: ["whatsub_room", "name"],
                showInList: true,
                networkSort: true
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
            sorts: [{key: "updated_at", sort: "desc"}],
            dialogActions: [{
                name: "Delete Leave Request", buttonType: "danger", // showIf: (item) => item.type === 'member',
                allMutations: [{
                    mutation_item: "update_whatsub_room_user_mapping", mutation: `mutation MyMutation($id: uuid = "") {
                                      update_whatsub_room_user_mapping(where: {id: {_eq: $id}}, _set: {leave_request: false}) {
                                        affected_rows
                                      }
                                    }`, keys: ["id"]
                }, {
                    mutation_item: "insert_processed_leave_request", mutation: `mutation MyMutation($leave_request_reason: String = "", $room_id: uuid = "", $user_id: uuid = "") {
                                      insert_processed_leave_request(objects: {reason: $leave_request_reason, room_id: $room_id, status: "delete", user_id: $user_id}) {
                                        affected_rows
                                      }
                                    }`, keys: ["leave_request_reason", "room_id", "user_id"]
                }],
            }, {
                name: "Remove Partial", buttonType: "danger", // showIf: (item) => item.type === 'member',
                allMutations: [{
                    mutation_item: "w_removeUserFromGroupPartial", mutation: `mutation removeUserFromGroupPartial($room_id: uuid = "", $user_id: uuid = "") {
                                  w_removeUserFromGroupPartial(request: {room_id: $room_id, user_id: $user_id}) {
                                    affected_rows
                                  }
                                }`, keys: ["room_id", "user_id"]
                }, {
                    mutation_item: "insert_processed_leave_request", mutation: `mutation MyMutation($leave_request_reason: String = "", $room_id: uuid = "", $user_id: uuid = "") {
                                      insert_processed_leave_request(objects: {reason: $leave_request_reason, room_id: $room_id, status: "partial", user_id: $user_id}) {
                                        affected_rows
                                      }
                                    }`, keys: ["leave_request_reason", "room_id", "user_id"]
                }],
            }, {
                name: "Remove Complete", buttonType: "danger", // showIf: (item) => item.type === 'member',
                allMutations: [{
                    mutation_item: "w_removeUserFromGroupComplete", mutation: `mutation removeUserFromGroupComplete($room_id: uuid = "", $user_id: uuid = "") {
                                  w_removeUserFromGroupComplete(request: {room_id: $room_id, user_id: $user_id}) {
                                    affected_rows
                                  }
                                }`, keys: ["room_id", "user_id"]
                }, {
                    mutation_item: "insert_processed_leave_request", mutation: `mutation MyMutation($leave_request_reason: String = "", $room_id: uuid = "", $user_id: uuid = "") {
                                      insert_processed_leave_request(objects: {reason: $leave_request_reason, room_id: $room_id, status: "complete", user_id: $user_id}) {
                                        affected_rows
                                      }
                                    }`, keys: ["leave_request_reason", "room_id", "user_id"]
                }],
            }],
            saveActions: []
        }]
    }
};
let adminLogs = {
    data: {
        components: [{
            type: "table", id: "adminLogsTable", title: "Admin Logs", query_item: "admin_dashboard_logs", query: `query MyQuery {
              admin_dashboard_logs(order_by: {}, limit: 100, offset: 0, where: {}) {
                id
                change
                changes
                query
                new_item
                old_item
                created_at
                updated_at
                user_id
                auth {
                  fullname
                  phone
                  email
                }
              }
            }`, heads: [{
                key: "id", name: "Id", type: "uuid"
            }, {
                key: "user_id", name: "User Id", type: "uuid"
            }, {
                key: "fullname",
                name: "Name",
                type: "string",
                showInList: true,
                nested_key: ["auth", "fullname"],
                networkSort: true
            }, {
                key: "phone", name: "Phone", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="https://api.whatsapp.com/send?phone=91' + item.phone + '&text=Hello, ' + item.fullname + '," target="_blank">' + item.phone + '</a>'
                }, nested_key: ["auth", "phone"], networkSort: true
            }, {
                key: "email", name: "Email", type: "string", nested_key: ["auth", "email"]
            }, {
                key: "change", name: "Change", type: "string", showInList: true, networkSort: true
            }, {
                key: "changes", name: "Changes", type: "object", showInList: true, link: {
                    type: "redirect", pathFunction: (item) => item.changes ? Object.keys(item.changes) : ""
                }
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
            }, {
                key: "query", name: "Query", type: "text"
            }, {
                key: "new_item", name: "New Item", type: "object"
            }, {
                key: "old_item", name: "Old Item", type: "object"
            }], filters: [], sorts: [{key: "created_at", sort: "desc"}], dialogActions: [], saveActions: []
        }]
    }
}

let shortLinksTable = {
    data: {
        components: [{
            type: "table",
            id: "shortLinksTable",
            title: "Short Links",
            top_buttons: [{
                name: "Add Short Link", buttonType: "dark", input: [{
                    key: "url_id", name: "URL Short Id", type: "string", canEdit: true, placeholder: "doddo"
                }, {
                    key: "url", name: "URL", type: "string", canEdit: true, placeholder: "https://grow90.org"
                }], dialogActions: [{
                    name: "Add Short Link", buttonType: "dark", allMutations: [{
                        mutation_item: "insert_whatsub_links", mutation: `mutation MyMutation($url_id: String = "", $url: String = "") {
                                          insert_whatsub_links(objects: {url_id: $url_id, url: $url}) {
                                            affected_rows
                                          }
                                        }`, keys: ["url_id", "url"]
                    }],
                }]
            }],
            query_item: "whatsub_links",
            query: `query MyQuery {
                                                                                                                      whatsub_links(where: {}, order_by: {}, limit: 100, offset: 0) {
                                                                                                                        id
                                                                                                                        url_id
                                                                                                                        url
                                                                                                                        hits
                                                                                                                        created_at
                                                                                                                        updated_at
                                                                                                                      }
                                                                                                                    }`,
            heads: [{
                key: "id", name: "Id", type: "uuid"
            }, {
                key: "url_id", name: "URL Id", type: "string", showInList: true, networkSort: true, canEdit: true
            }, {
                key: "url", name: "URL", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="' + item.url + '" target="_blank">' + item.url + '</a>'
                }, networkSort: true, canEdit: true
            }, {
                key: "short_url", name: "Short URL", type: "string", showInList: true, link: {
                    type: "redirect",
                    pathFunction: (item) => '<a href="/go/' + item.short_url + '" target="_blank">https://grow90.org/go/' + item.short_url + '</a>'
                }, nested_key: ["url_id"], networkSearch: false
            }, {
                key: "hits", name: "Hits", type: "number", showInList: true, networkSort: true
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
                keys: ["id", "url", "url_id"], mutation: `mutation MyMutation($id: uuid = "", $url: String = "", $url_id: String = "") {
                                  update_whatsub_links(where: {id: {_eq: $id}}, _set: {url: $url, url_id: $url_id}) {
                                    affected_rows
                                  }
                                }`, mutation_item: "update_whatsub_links"
            }]
        }]
    }
}
let autoReplyTable = {
    data: {
        components: [{
            type: "table", id: "autoReplyTable", title: "Auto Reply", top_buttons: [{
                name: "Add Auto Reply", buttonType: "dark", input: [{
                    key: "text", name: "Text", type: "string", canEdit: true, placeholder: "Who is Pakistan?"
                }, {
                    key: "reply", name: "Reply", type: "string", canEdit: true, placeholder: "PKMKB!"
                }], dialogActions: [{
                    name: "Add Auto reply", buttonType: "dark", allMutations: [{
                        mutation_item: "insert_whatsub_chatterbot", mutation: `mutation MyMutation($reply: String = "", $text: String = "") {
                                                                                  insert_whatsub_chatterbot(objects: {text: $text, reply: $reply}) {
                                                                                    affected_rows
                                                                                  }
                                                                                }`, keys: ["text", "reply"]
                    }],
                }]
            }], query_item: "whatsub_chatterbot", query: `query MyQuery {
                          whatsub_chatterbot(where: {}, order_by: {}) {
                            reply
                            text
                            id
                            created_at
                            updated_at
                          }
                        }`, heads: [{
                key: "id", name: "Id", type: "uuid"
            }, {
                key: "text", name: "Text", type: "string", showInList: true, networkSort: true
            }, {
                key: "reply", name: "Reply", type: "string", showInList: true, networkSort: true
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
            }], filters: [], sorts: [{key: "created_at", sort: "desc"}], dialogActions: [], saveActions: []
        }]
    }
}
