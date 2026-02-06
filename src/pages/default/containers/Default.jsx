import { useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';
import Typography from 'components/Typography';
import Link from "../../../components/Link";
import Button from "../../../components/Button"; // Твій кастомний компонент
import pagesURLs from "../../../constants/pagesURLs";
import * as pages from "../../../constants/pages";

function Default() {
    const { formatMessage } = useIntl();

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h3">
                {formatMessage({ id: 'title' })}
            </Typography>

            <div style={{ marginTop: '20px' }}>
                <Link to={{ pathname: pagesURLs[pages.books] }}>
                    <Typography color="secondary" variant="h5">
                        <strong>→ {formatMessage({ id: 'allBooks' })}</strong>
                    </Typography>
                </Link>
            </div>
        </div>
    );
}

export default Default;