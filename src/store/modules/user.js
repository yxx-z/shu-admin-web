import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        eamil: '',
        uid: ''
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        console.log('token= ', token)
        state.token = token
    },
    SET_NAME: (state, name) => {
        console.log('name= ', name)
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        console.log('avatar= ', avatar)
        state.avatar = avatar
    },
    SET_EMAIL: (state, email) => {
        console.log('email= ', email)
        state.email = email
    },
    SET_UID: (state, uid) => {
        console.log('uid= ', uid)
        state.uid = uid
    }
}

const actions = {
    // user login
    login ({ commit }, userInfo) {
        const { loginCode, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ loginCode: loginCode.trim(), password: password }).then(response => {
                commit('SET_TOKEN', 'Bearer ' + response.data.token)
                setToken('Bearer ' + response.data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo ({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                // const { data } = response
                if (!response) {
                    return reject('Verification failed, please Login again.')
                }

                const { id, loginName, avatar, email } = response.data

                commit('SET_NAME', loginName)
                commit('SET_AVATAR', avatar)
                commit('SET_EMAIL', email)
                commit('SET_UID', id)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout ({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken ({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

