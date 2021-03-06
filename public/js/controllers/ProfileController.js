import { ProfileView } from '../views/Profile/ProfileView';
import { Controller } from '../modules/controller';
import { PROFILE } from '../modules/events';

export class ProfileController extends Controller {
  constructor (root, globalEventBus, router) {
    super(root, globalEventBus, router);

    this._globalEventBus.subscribeToEvent(PROFILE.saveProfileSuccess, () => {
      this._router.redirect({ path: '/' });
    });

    this._view = new ProfileView(this._root, this._globalEventBus);
  }
}
