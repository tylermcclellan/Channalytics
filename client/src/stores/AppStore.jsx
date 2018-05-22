import {
  observable,
  autorun,
  computed
} from 'mobx'

class AppStore {
  @observable currentChannel = 'general'
  @observable userMaster = fetch(`/api/run/${currentChannel}/`)
  @observable channelMaster = fetch(`/api/run/`)

  @computed 
}
