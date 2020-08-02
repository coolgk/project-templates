import { expect, use } from 'chai';
import chaiDom from 'chai-dom';
use(chaiDom);
import { waitFor, fireEvent, RenderResult } from '@testing-library/react/pure';

import { config } from 'src/config';
import { renderApp } from 'tests/utils/renderApp';
import Index from 'src/pages/index';

describe('index', () => {
  context('given index page has been rendered', () => {
    let page: RenderResult;
    before(async () => {
      page = renderApp(Index);
      await waitFor(() => page.getByRole('main'));
    });

    context('when page shows', () => {
      it('should show button', () => {
        expect(page.getByText('show error')).to.be.visible;
      });
    });

    context('when show error button is clicked', () => {
      before(() => {
        fireEvent.click(page.getByText('show error'));
      });

      it('should show error message', () => {
        expect(page.getByTestId('error-message')).to.have.text(`error message: fetch ${config.api.data}`);
      });
    });
  });
});
